<script>
  import { onMount } from "svelte";
  import { goto } from "@roxi/routify";

  export let disabled = false;
  export let focused = false;
  export let type = "primary";
  export let href = null;
  export let isExternalHref = false;
  export let block = false;
  export let submit = false;
  export let className = "";

  let buttonElem;

  if (!type) {
    type = "primary";
  }

  onMount(() => {
    if (buttonElem && focused) {
      buttonElem.focus();
    }
  });

  function followLink() {
    if (href && !disabled) {
      if (isExternalHref) {
        window.open(href, "_blank");
      } else {
        $goto(href);
      }
    }
  }

  function getColorClasses(type) {
    switch (type) {
      case "primary":
        return "text-white bg-primary hover:bg-background focus:ring-primary disabled:bg-primaryinactive disabled:hover:bg-primaryinactive border-transparent";
      case "secondary":
        return "text-sky-700 bg-sky-100 hover:bg-sky-200 focus:ring-sky-500 disabled:bg-sky-300 disabled:hover:bg-sky-300 border-transparent";
      case "black":
        return "text-white bg-gray-800 hover:bg-gray-900 focus:ring-gray-900 disabled:bg-gray-400 disabled:hover:bg-gray-400 border-transparent";
      case "danger":
      case "error":
        return "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300 disabled:hover:bg-red-300 border-transparent";
      case "danger-secondary":
      case "error-secondary":
        return "text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500 disabled:bg-red-300 disabled:hover:bg-red-300 border-transparent";
        return "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300 disabled:hover:bg-red-300 border-transparent";
      case "success":
        return "text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300 disabled:hover:bg-green-300 border-transparent";
      case "success-secondary":
        return "text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500 disabled:bg-green-300 disabled:hover:bg-green-300 border-transparent";
      case "info":
        return "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300 disabled:hover:bg-blue-300 border-transparent";
      case "info-secondary":
        return "text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500 disabled:bg-blue-300 disabled:hover:bg-blue-300 border-transparent";
      case "warning":
        return "text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 disabled:bg-yellow-300 disabled:hover:bg-yellow-300 border-transparent";
      case "warning-secondary":
        return "text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:ring-yellow-500 disabled:bg-yellow-300 disabled:hover:bg-yellow-300 border-transparent";
      case "simple":
        return "text-gray-700 bg-white hover:bg-gray-50 focus:ring-sky-500 disabled:bg-gray-200 disabled:hover:bg-gray-200 border-gray-300";
    }

    return "";
  }
</script>

{#if href}
  <button
    type="button"
    {disabled}
    class:w-full={block}
    class="inline-flex items-center justify-center shadow-sm py-2 px-4 border
    text-2xl font-medium rounded-md focus:outline-none focus:ring-2
    focus:ring-offset-2 {getColorClasses(type)}
    {className}"
    on:click={followLink}
    bind:this={buttonElem}>
    <slot />
  </button>
{:else}
  <button
    type={submit ? 'submit' : 'button'}
    {disabled}
    class:w-full={block}
    class="inline-flex items-center justify-center shadow-sm py-2 px-4 border
    text-2xl font-medium rounded-md focus:outline-none focus:ring-2
    focus:ring-offset-2 {getColorClasses(type)}
    {className}"
    on:click
    bind:this={buttonElem}>
    <slot />
  </button>
{/if}
