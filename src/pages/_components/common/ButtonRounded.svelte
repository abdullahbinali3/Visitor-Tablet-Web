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
  export let size = "default";

  let buttonElem;

  if (!type) {
    type = "primary";
  }

  if (!size) {
    type = "default";
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
        return "text-white bg-background disabled:bg-primaryinactive disabled:hover:bg-primaryinactive border-transparent";
      case "secondary":
        return "text-white bg-secondary2 disabled:bg-primaryinactive disabled:hover:bg-primaryinactive border-transparent";
      case "blue":
        return "text-white bg-nameplateblue disabled:bg-primaryinactive disabled:hover:bg-primaryinactive border-transparent";
    }

    return "";
  }
</script>

{#if href}
  <button
    type="button"
    {disabled}
    class:w-full={block}
    class="uppercase inline-flex items-center justify-center drop-shadow-xl {size === 'sm' ? 'py-2' : 'py-5'} px-8 border
      font-bold focus:outline-none
      {getColorClasses(type)}
      {className}"
    style="{size === 'sm' ? 'font-size: 1.15rem;' : 'font-size: 1.65rem;'} border-radius: 3rem"
    on:click={followLink}
    bind:this={buttonElem}
  >
    <slot />
  </button>
{:else}
  <button
    type={submit ? "submit" : "button"}
    {disabled}
    class:w-full={block}
    class="uppercase inline-flex items-center justify-center drop-shadow-xl {size === 'sm' ? 'py-2' : 'py-5'} px-8 border
      font-bold focus:outline-none
      {getColorClasses(type)}
      {className}"
    style="{size === 'sm' ? 'font-size: 1.15rem;' : 'font-size: 1.65rem;'} border-radius: 3rem"
    on:click
    bind:this={buttonElem}
  >
    <slot />
  </button>
{/if}
