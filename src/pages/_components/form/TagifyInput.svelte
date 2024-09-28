<script>
  import { onMount } from "svelte";
  import Tagify from "@yaireo/tagify";

  export let value = [];
  export let valueJson = "";
  export let initialValue = [];
  export let label = null;
  export let labelIsSROnly = false;
  export let placeholder = null;
  export let valid = true;
  export let errorMessage = false;
  export let touched = false;
  export let disabled = false;
  export let required = false;
  export let containerClass = null;
  export let helperText = null;
  export let errorUseVisibility = false;
  export let tagify = null;

  $: updateDisabled(disabled);

  // if (placeholder === null) {
  //   placeholder = label;
  // }

  let inputElem = null;

  // Generate random string for name
  let name = Math.random()
    .toString(36)
    .slice(2);

  function getBorderColor() {
    if (!valid && touched) {
      return "focus:ring-red-500 focus:border-red-500 border-red-300";
    } else {
      return "focus:ring-sky-500 focus:border-sky-500 border-gray-300";
    }
  }

  $: borderClasses = getBorderColor(!valid && touched);

  onMount(() => {
    tagify = new Tagify(inputElem);

    if (Array.isArray(initialValue) && initialValue.length > 0) {
      let tagArray = [];

      for (let i = 0; i < initialValue.length; ++i) {
        tagArray.push({ value: initialValue[i] });
      }

      tagify.addTags(tagArray);
    }

    tagify.on("change", function(e) {
      valueJson = e.detail.value;
      value = [];

      if (valueJson) {
        let parsedValue = JSON.parse(valueJson);
        for (let i = 0; i < parsedValue.length; ++i) {
          value.push(parsedValue[i].value);
        }
      }

      value = value;
    });

    // returned function will be called when component unmounts
    return destructor;
  });

  function updateDisabled(state) {
    if (tagify) {
      tagify.setDisabled(state);
    }
  }

  function destructor() {
    if (tagify) {
      tagify.destroy();
      tagify = null;
    }
  }
</script>

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
  <input
    bind:this={inputElem}
    id={name}
    {name}
    {placeholder}
    {disabled}
    class="mt-1 block w-full shadow-sm sm:text-sm rounded-md disabled:bg-gray-50
    disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none {borderClasses}" />
  {#if errorUseVisibility}
    <p
      class="text-sm text-rose-500 font-medium {helperText ? "-mb-3" : ""}"
      class:invisible={!(errorMessage && !valid && touched)}>
      {errorMessage}
    </p>
  {:else if errorMessage && !valid && touched}
    <p class="text-sm text-rose-500 font-medium {helperText ? "-mb-3" : ""}">{errorMessage}</p>
  {/if}
  {#if helperText}
    <p class="mt-2 text-sm text-gray-500 leading-4">{helperText}</p>
  {/if}
</div>
