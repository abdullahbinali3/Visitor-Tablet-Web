<script>
  import { url } from "@roxi/routify";
  import { t } from "svelte-i18n";
  import { guid_to_base64 } from "$helpers/guid.js";
  import SolidChevronDownIcon from "$icons/SolidChevronDownIcon.svelte";
  import SolidChevronRightIcon from "$icons/SolidChevronRightIcon.svelte";

  export let organizationId;
  export let building;

  let open = false;

  function toggleOpen() {
    open = !open;
  }
</script>

{#if building}
  <button
    type="button"
    class="z-10 sticky top-0 text-xl text-left w-full font-medium text-white bg-primary flex items-center border-t border-l border-r p-4 border-gray-400 cursor-pointer select-none hover:bg-background truncate"
    class:border-b={!open}
    on:click={toggleOpen}
  >
    {#if !open}
      <SolidChevronRightIcon />
    {:else}
      <SolidChevronDownIcon />
    {/if}
    {building.text}
  </button>
  {#if open}
    <nav class="border-b border-gray-400">
      <div class="relative">Todo</div>
    </nav>
  {/if}
{/if}
