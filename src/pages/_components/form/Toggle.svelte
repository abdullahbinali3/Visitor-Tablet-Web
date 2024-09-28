<script>
  export let label = null;
  export let subLabel = null;
  export let value = false;
  export let disabled = false;

  // Generate random string for name
  let name = Math.random()
    .toString(36)
    .slice(2);

  $: buttonClass = getButtonClass(value, disabled);
  $: spanClass = value === true ? "translate-x-5" : "translate-x-0";

  function getButtonClass(value, disabled) {
    if (!disabled) {
      return value === true ? "bg-sky-600" : "bg-gray-400";
    } else {
      return value === true ? "bg-sky-200" : "bg-gray-100";
    }
  }

  function toggle() {
    if (disabled) {
      return;
    }

    value = !value;
  }
</script>

<div class="flex items-center">
  <!-- Enabled: "bg-sky-600", Not Enabled: "bg-gray-200" -->
  <button
    on:click={toggle}
    type="button"
    {disabled}
    class="{buttonClass} relative inline-flex flex-shrink-0 h-6 w-11 border-2
    border-transparent rounded-full cursor-pointer transition-colors ease-in-out
    duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    focus:ring-sky-500"
    role="switch"
    aria-checked={value}
    aria-labelledby={name}>
    <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
    <span
      aria-hidden="true"
      class="{spanClass} pointer-events-none inline-block h-5 w-5 rounded-full
      bg-white shadow transform ring-0 transition ease-in-out duration-200" />
  </button>
  <span class="ml-3 cursor-pointer" id={name} on:click={toggle}>
    <slot>
      {#if label}
        <span class="text-sm font-medium text-gray-900">{label}</span>
      {/if}
      {#if subLabel}
        <span class="text-sm text-gray-500">{subLabel}</span>
      {/if}
    </slot>
  </span>
</div>
