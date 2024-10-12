<!-- HostVisitorSelector.svelte -->
<script>
  import { t } from "svelte-i18n";
  import SolidSearchIcon from "$icons/SolidSearchIcon.svelte";

  export let title = "";
  export let searchValue = "";
  export let filteredItems = [];
  export let selectItem = (item) => {};
  export let isSelected = (item) => false;
  export let showItems = true; // Controls the visibility of the component
  export let placeholder = "";

  function updateSearch(val) {
    searchValue = val;
  }
</script>

<div>
  <div class="text-black text-2xl">{title}</div>
  <div class="mt-4 relative w-full border ring-1 ring-black ring-opacity-5">
    <SolidSearchIcon className="pointer-events-none absolute top-3 left-4 h-8 w-8 text-gray-400" />
    <input
      type="text"
      bind:value={searchValue}
      on:input={(e) => updateSearch(e.target.value)}
      class="h-12 w-full border-0 bg-transparent pl-[4rem] pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 text-2xl mb-1"
      placeholder={placeholder}
    />
  </div>
  {#if showItems}
    <div class="h-[10rem] overflow-y-scroll bg-white shadow ring-1 ring-black ring-opacity-5 rounded-b-md">
      <ul class="divide-y divide-gray-200">
        {#each filteredItems as item}
          <li
            class="cursor-pointer px-4 py-2 truncate text-2xl font-medium"
            on:click={() => selectItem(item)}
            class:bg-gray-300={isSelected(item)}
          >
            {item.name}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
