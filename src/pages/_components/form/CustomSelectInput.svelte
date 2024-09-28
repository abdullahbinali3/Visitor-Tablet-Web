<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { isDescendant } from "$helpers/elements.js";
  import { multiSearchOr } from "$helpers/search.js";
  import SolidSelectorIcon from "$icons/SolidSelectorIcon.svelte";
  import SolidCheckIcon from "$icons/SolidCheckIcon.svelte";
  import SolidXIcon from "$icons/SolidXIcon.svelte";
  import CircleSpinner from "$components/common/CircleSpinner.svelte";

  export let value = null;
  export let label = null;
  export let labelIsSROnly = false;
  export let placeholder = null;
  export let valid = true;
  export let errorMessage = false;
  export let touched = false;
  export let disabled = false;
  export let required = false;
  export let tabindex = null;
  export let containerClass = null;
  export let helperText = null;
  export let errorUseVisibility = false;
  export let searchFunc = builtInSearch;
  export let searchCancelFunc = null;
  export let ajaxDelay = 400;
  export let isAjax = false;
  export let loading = false;
  export let ajaxError = false;

  export let noResultsText = "No items to display.";
  export let typeToSearchText = "Start typing to search.";
  export let typingText = "Typing...";
  export let loadingText = "Loading...";
  export let ajaxErrorText = "Loading results failed.";
  export let valueVariable = "value";
  export let textVariable = "text";
  export let items = []; // should be array of object { value: 123, text: "abc" }
  export const searchFinishedCallback = handleSearchFinished;

  if (placeholder === null) {
    placeholder = label;
  }

  let itemsFiltered = items;

  const dispatch = createEventDispatcher();

  let inputElem;
  let selectorElem;
  let clearElem;
  let open = false;
  let activeValue = null;
  let inputElemValue = null;
  let ajaxTextForValue = null;
  let debounceTimeout;

  // Generate random string for name
  let name = Math.random()
    .toString(36)
    .slice(2);

  function getBorderColor() {
    if (!valid && touched && !disabled) {
      return "focus:ring-red-500 focus:border-red-500 border-red-300 placeholder-red-500";
    } else {
      return "focus:ring-sky-500 focus:border-sky-500 border-gray-300";
    }
  }

  $: borderClasses = getBorderColor(!valid && touched);

  onMount(function() {
    if (value) {
      inputElemValue = getTextForValue(value);
      ajaxTextForValue = inputElemValue;
    }
  });

  function handleClickSelector() {
    if (inputElem) {
      inputElem.focus();
    }

    if (isAjax && inputElemValue) {
      if (open) {
        if (searchCancelFunc) {
          searchCancelFunc();
        }

        open = false;
        inputElemValue = ajaxTextForValue;
      }
      return;
    }

    open = !open;

    if (!open) {
      if (!isAjax) {
        itemsFiltered = items;
      }

      inputElemValue = getTextForValue(value);
      ajaxTextForValue = inputElemValue;
    }
  }

  function handleClickClear() {
    if (searchCancelFunc) {
      searchCancelFunc();
    }

    open = false;
    itemsFiltered = items;
    value = null;
    inputElemValue = value;
    ajaxTextForValue = inputElemValue;
    activeValue = value;
    dispatch("itemselected", value);
  }

  function handleBodyClicked(e) {
    if (
      open &&
      e.target !== inputElem &&
      !isDescendant(inputElem, e.target) &&
      e.target !== selectorElem &&
      !isDescendant(selectorElem, e.target) &&
      e.target !== clearElem &&
      !isDescendant(clearElem, e.target)
    ) {
      open = false;

      if (isAjax) {
        inputElemValue = ajaxTextForValue;
      } else {
        itemsFiltered = items;
        inputElemValue = getTextForValue(value);
      }
    }
  }

  function handleSearchInput(e) {
    if (!isAjax) {
      open = true;
      searchFunc(e.target.value, handleSearchFinished);
      return;
    }

    if (searchCancelFunc) {
      searchCancelFunc();
    }

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    open = true;

    if (e.target.value !== "") {
      debounceTimeout = setTimeout(() => {
        debounceTimeout = null;
        searchFunc(e.target.value, handleSearchFinished);
      }, ajaxDelay);
    }
  }

  function handleSearchFinished(newItems) {
    itemsFiltered = newItems;

    // When searching, if current value is in results, then highlight it (set to active),
    // otherwise highlight the first item
    if (itemsFiltered && itemsFiltered.length > 0) {
      if (itemsFiltered.find(item => item[valueVariable] === value)) {
        activeValue = value;
      } else {
        activeValue = itemsFiltered[0][valueVariable];
      }
    } else {
      activeValue = null;
    }
  }

  function handleItemSelected(selectedValue) {
    if (searchCancelFunc) {
      searchCancelFunc();
    }

    if (!isAjax) {
      itemsFiltered = items;
    }

    inputElemValue = getTextForValue(selectedValue);
    ajaxTextForValue = inputElemValue;
    dispatch("itemselected", selectedValue);
  }

  function builtInSearch(searchValue, searchFinishedFunc) {
    if (searchValue === "") {
      searchFinishedFunc(items);
      return;
    }

    let searchTerms = searchValue.split(" ");

    if (searchTerms.length === 0) {
      searchFinishedFunc(items);
      return;
    }

    let newItems = items.filter(item => {
      return multiSearchOr(item[textVariable], searchTerms);
    });

    searchFinishedFunc(newItems);
  }

  function getTextForValue(val) {
    if (items) {
      try {
        return items.find(item => item[valueVariable] === val)[textVariable];
      } catch {
        return null;
      }
    }

    return null;
  }

  function handleKeydown(e) {
    let key = e.keyCode;
    switch (key) {
      case 9: // tab
      case 13: // enter
        e.preventDefault();

        if (isAjax && (!open || !inputElemValue)) {
          return;
        }

        if (searchCancelFunc) {
          searchCancelFunc();
        }

        if (activeValue) {
          // set the highlighted value to the component's value
          value = activeValue;
          dispatch("itemselected", activeValue);
        }

        if (!isAjax) {
          itemsFiltered = items;
        }

        if (isAjax && !activeValue) {
          inputElemValue = ajaxTextForValue;
        } else {
          // set the input field text to the selected value and close the combo box
          inputElemValue = getTextForValue(value);
          ajaxTextForValue = inputElemValue;
        }
        open = false;
        break;
      case 27: // escape
        e.preventDefault();

        handleClickClear();
        open = true;
        break;
      case 38: // up arrow
      case 40: // down arrow
        e.preventDefault();

        if (isAjax && (!open || !inputElemValue)) {
          return;
        }

        // up = -1, down = 1
        let direction = key === 38 ? -1 : 1;

        // find index of the currently highlighted item
        let idx = itemsFiltered.findIndex(
          item => item[valueVariable] === activeValue
        );

        // ignore going up if at the top
        if (idx <= 0 && direction === -1) {
          return;
        }
        // ignore going down if at the bottom
        if (idx >= itemsFiltered.length - 1 && direction === 1) {
          return;
        }

        // move the highlight in the specified direction based on the arrow key pressed
        activeValue = itemsFiltered[idx + direction][valueVariable];
        break;
    }
  }

  function handleInputClicked() {
    if (!isAjax || !inputElemValue) {
      open = true;
    }
  }
</script>

<svelte:body on:click={handleBodyClicked} />

<div class={containerClass}>
  {#if label}
    {#if labelIsSROnly}
      <label for={name} class="sr-only">{label}</label>
    {:else}
      <!-- see "Before and after": https://tailwindcss.com/docs/hover-focus-and-other-states?email=george%40krugerindustrial.ac&password=Bosco -->
      <label for={name} class="block">
        <span
          class="{required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ''}
          block text-sm font-medium text-gray-700">
          {label}
        </span>
      </label>
    {/if}
  {/if}
  <div class="relative mt-1">
    <input
      autocomplete="off"
      bind:this={inputElem}
      on:click={handleInputClicked}
      on:input={handleSearchInput}
      id={name}
      {name}
      {placeholder}
      {disabled}
      {tabindex}
      bind:value={inputElemValue}
      on:keydown={handleKeydown}
      type="text"
      class="w-full rounded-md border bg-white py-2 pl-3 pr-12 shadow-sm
      disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200
      disabled:shadow-none disabled:placeholder-gray-500 focus:outline-none
      focus:ring-1 sm:text-sm {borderClasses}"
      role="combobox"
      aria-controls="options"
      aria-expanded={open} />
    <button
      bind:this={clearElem}
      type="button"
      class="absolute inset-y-0 right-8 flex items-center rounded-r-md px-2
      focus:outline-none"
      {disabled}
      on:click={handleClickClear}>
      <SolidXIcon
        classColor={!valid && touched && !disabled ? 'text-red-400' : 'text-gray-400'} />
    </button>
    <button
      bind:this={selectorElem}
      type="button"
      class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2
      focus:outline-none"
      {disabled}
      on:click={handleClickSelector}>
      <SolidSelectorIcon
        classColor={!valid && touched && !disabled ? 'text-red-400' : 'text-gray-400'} />
    </button>

    {#if open && !disabled}
      {#if isAjax && (!inputElemValue || ajaxError || loading || debounceTimeout)}
        <div
          class="absolute z-[1] mt-1 max-h-60 w-full overflow-auto rounded-md
          bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5
          focus:outline-none sm:text-sm">
          <p
            class="cursor-default select-none py-2 pl-3 pr-9 text-sm
            text-gray-500">
            {#if !inputElemValue}
              {typeToSearchText}
            {:else if ajaxError}
              <span class="text-red-600">{ajaxErrorText}</span>
            {:else if loading}
              <CircleSpinner delay={0} className="h-4 w-4 inline-block" />
              {loadingText}
            {:else if debounceTimeout}{typingText}{/if}
          </p>
        </div>
      {:else if itemsFiltered && itemsFiltered.length > 0}
        <ul
          class="absolute z-[1] mt-1 max-h-60 w-full overflow-auto rounded-md
          bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5
          focus:outline-none sm:text-sm"
          id="options"
          role="listbox">

          <!--
            Combobox option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

            Active: "text-white bg-sky-600", Not Active: "text-gray-900"
          -->
          {#each itemsFiltered as item (item[valueVariable])}
            <li
              on:click={() => {
                handleItemSelected(item[valueVariable]);
              }}
              on:mouseenter={() => {
                activeValue = item[valueVariable];
              }}
              on:mouseleave={() => {
                activeValue = null;
              }}
              class="relative cursor-default select-none py-2 pl-3 pr-9 {activeValue === item[valueVariable] ? 'text-white bg-sky-600' : 'text-gray-900'}"
              role="option"
              tabindex="-1">
              <!-- Selected: "font-semibold" -->
              <span
                class="block truncate"
                class:font-semibold={value === item[valueVariable]}>
                {item[textVariable]}
              </span>

              <!--
                Checkmark, only display for selected option.

                Active: "text-white", Not Active: "text-sky-600"
              -->
              {#if value === item[valueVariable]}
                <span
                  class="absolute inset-y-0 right-0 flex items-center pr-4 {activeValue === item[valueVariable] ? 'text-white' : 'text-sky-600'}">
                  <SolidCheckIcon />
                </span>
              {/if}
            </li>
          {/each}

        </ul>
      {:else}
        <!-- Empty state, show/hide based on command palette state -->
        <div
          class="absolute z-[1] mt-1 max-h-60 w-full overflow-auto rounded-md
          bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5
          focus:outline-none sm:text-sm">
          <p
            class="cursor-default select-none py-2 pl-3 pr-9 text-sm
            text-gray-500">
            {noResultsText}
          </p>
        </div>
      {/if}
    {/if}
  </div>
  {#if errorUseVisibility}
    <p
      class="text-sm text-rose-500 font-medium {helperText ? '-mb-3' : ''}"
      class:invisible={!(errorMessage && !valid && touched)}>
      {errorMessage}
    </p>
  {:else if errorMessage && !valid && touched}
    <p class="text-sm text-rose-500 font-medium {helperText ? '-mb-3' : ''}">
      {errorMessage}
    </p>
  {/if}
  {#if helperText}
    <p class="mt-2 text-sm text-gray-500 leading-4">{helperText}</p>
  {/if}
</div>
