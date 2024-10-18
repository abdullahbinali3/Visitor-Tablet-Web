<script>
  export let value = null;
  export let label = null;
  export let labelIsSROnly = false;
  export let valid = true;
  export let errorMessage = false;
  export let touched = false;
  export let disabled = false;
  export let required = false;
  export let tabindex = null;
  export let containerClass = null;
  export let helperText = null;
  export let errorUseVisibility = false;

  export let items = [];

  // Generate random string for name
  let name = Math.random()
    .toString(36)
    .slice(2);

    function getBorderColor() {
    if (!valid && touched) {
      return "focus:ring-red-500 focus:border-red-500 border-red-300";
    } else {
      return "focus:ring-primary focus:border-primary border-gray-300";
    }
  }

  $: borderClasses = getBorderColor(!valid && touched);


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
          block text-2xl font-medium text-gray-700">
          {label}
        </span>
      </label>
    {/if}
  {/if}
  <select
    class="mt-1 block w-full shadow-sm rounded-md disabled:bg-gray-50
    disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none {borderClasses}"
    bind:value
    id={name}
    {name}
    {disabled}
    {tabindex}
    on:change
    on:blur={() => (touched = true)}>
    <option value=""  disabled selected={!value}>-- Select --</option>

    {#each items as item}
      {#if typeof item === 'string'}
        <option value={item}>{item}</option>
      {:else if typeof item === 'object'}
        <option value={item.value}>{item.text}</option>
      {/if}
    {/each}
  </select>
  {#if errorUseVisibility}
    <p
      class="text-2xl text-rose-500 font-medium {helperText ? "-mb-3" : ""}"
      class:invisible={!(errorMessage && !valid && touched)}>
      {errorMessage}
    </p>
  {:else if errorMessage && !valid && touched}
    <p class="text-2xl text-rose-500 font-medium {helperText ? "-mb-3" : ""}">{errorMessage}</p>
  {/if}
  {#if helperText}
    <p class="mt-2 text-2xl text-gray-500 leading-4">{helperText}</p>
  {/if}
</div>
