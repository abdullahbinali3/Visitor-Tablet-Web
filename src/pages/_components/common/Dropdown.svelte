<script>
  import { createEventDispatcher } from "svelte";
  import { scale } from "svelte/transition";
  import { isDescendant } from "$helpers/elements.js";
  import SolidChevronDownIcon from "$icons/SolidChevronDownIcon.svelte";

  export let title;
  export let value = null;
  export let valueVariable = "value";
  export let textVariable = "text";
  export let containerClass = null;
  export let dropdownItemWidth = "w-40";

  export let items = [];

  const dispatch = createEventDispatcher();

  let elem;
  let open = false;
  let activeValue = value;

  // Generate random string for name
  let name = Math.random()
    .toString(36)
    .slice(2);

  function handleDropdownClick() {
    open = !open;
  }

  function handleBodyClicked(e) {
    if (open && e.target !== elem && !isDescendant(elem, e.target)) {
      open = false;
    }
  }

  function handleItemSelected(selectedValue) {
    open = false;
    dispatch("itemselected", selectedValue);
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
    e.preventDefault();
    let key = e.keyCode;
    switch (key) {
      case 9: // tab
      case 13: // enter
        if (open) {
          if (activeValue) {
            // set the highlighted value to the component's value
            dispatch("itemselected", activeValue);
          }
          // close the combo box
          open = false;
        } else if (key === 13) {
          open = true;
        }
        break;
      case 27: // escape
        if (!open) {
          return;
        }

        handleClickClear();
        open = true;
        break;
      case 38: // up arrow
      case 40: // down arrow
        if (!open) {
          return;
        }

        // up = -1, down = 1
        let direction = key === 38 ? -1 : 1;

        // find index of the currently highlighted item
        let idx = items.findIndex(item => item[valueVariable] === activeValue);

        // ignore going up if at the top
        if (idx <= 0 && direction === -1) {
          return;
        }
        // ignore going down if at the bottom
        if (idx >= items.length - 1 && direction === 1) {
          return;
        }

        // move the highlight in the specified direction based on the arrow key pressed
        activeValue = items[idx + direction][valueVariable];
        break;
    }
  }
</script>

<svelte:body on:click={handleBodyClicked} />

<div class="relative inline-block text-left {containerClass}" bind:this={elem}>
  <div>
    <button
      on:keydown={handleKeydown}
      on:click={handleDropdownClick}
      type="button"
      class="group inline-flex justify-center text-sm font-medium text-gray-700
      hover:text-gray-900"
      id={name}
      aria-expanded={open}
      aria-haspopup="true">
      {title}
      <SolidChevronDownIcon
        className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400
        group-hover:text-gray-500" />
    </button>
  </div>

  {#if open}
    <!--
      Dropdown menu, show/hide based on menu state.

      Entering: "transition ease-out duration-100"
        From: "transform opacity-0 scale-95"
        To: "transform opacity-100 scale-100"
      Leaving: "transition ease-in duration-75"
        From: "transform opacity-100 scale-100"
        To: "transform opacity-0 scale-95"
    -->
    <div
      in:scale={{ start: 0.95, duration: 100 }}
      out:scale={{ start: 0.95, duration: 75 }}
      class="origin-top-right absolute right-0 mt-2 {dropdownItemWidth}
      rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5
      focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby={name}
      tabindex="-1">
      <div class="py-1" role="none">
        <!--
          Active: "bg-gray-100", Not Active: ""

          Selected: "font-medium text-gray-900", Not Selected: "text-gray-500"
        -->
        {#each items as item (item[valueVariable])}
          <div
            on:click={() => {
              handleItemSelected(item[valueVariable]);
            }}
            on:mouseenter={() => {
              activeValue = item[valueVariable];
            }}
            on:mouseleave={() => {
              activeValue = null;
            }}
            class="cursor-pointer block px-4 py-2 text-sm {activeValue === item[valueVariable] ? 'bg-gray-100' : ''}
            {value === item[valueVariable] ? 'font-medium text-gray-900' : 'text-gray-500'}"
            role="menuitem"
            tabindex="-1">
            {item[textVariable]}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
