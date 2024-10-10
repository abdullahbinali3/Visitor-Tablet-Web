<script>
  import { t } from "svelte-i18n";
  import SolidSearchIcon from "$icons/SolidSearchIcon.svelte";
  let filteredHosts = [];
  let filteredVisitors = [];
  let selectedHost = null;
  let selectedVisitors = [];
  let showVisitors = false;
  let searchValueHost = "";
  let searchValueVisitor = "";

  // Sample data for hosts and visitors
  let hosts = [
    { id: 1, name: "Host 1" },
    { id: 2, name: "Host 2" },
    { id: 3, name: "Host 3" },
    
  ];

  let visitors = [
    { id: 1, name: "Visitor 1" },
    { id: 2, name: "Visitor 2" },
    { id: 3, name: "Visitor 3" },
    { id: 4, name: "Visitor 4" },
  ];

  // Initialize with all hosts and visitors
  filteredHosts = [...hosts];
  filteredVisitors = [...visitors];

  function selectHost(host) {
    selectedHost = host;
    selectedVisitors = []; // Reset visitors on host selection
    showVisitors = true;
    searchValueVisitor = ""; // Reset visitor search input
    updateSearchVisitors("");
  }

  function toggleVisitor(visitor) {
    if (selectedVisitors.includes(visitor)) {
      selectedVisitors = selectedVisitors.filter(v => v !== visitor);
    } else {
      selectedVisitors = [...selectedVisitors, visitor];
    }
  }

  function submitSelection() {
    console.log("Selected Host:", selectedHost);
    console.log("Selected Visitors:", selectedVisitors);
    resetForm();
  }

  function resetForm() {
    selectedHost = null;
    selectedVisitors = [];
    searchValueHost = "";
    searchValueVisitor = "";
    filteredHosts = [...hosts];
    filteredVisitors = [...visitors];
    showVisitors = false;
  }

  function updateSearchHosts(val) {
    searchValueHost = val;
    filteredHosts = hosts.filter(host => host.name.toLowerCase().includes(val.toLowerCase()));
  }

  function updateSearchVisitors(val) {
    searchValueVisitor = val;
    filteredVisitors = visitors.filter(visitor => visitor.name.toLowerCase().includes(val.toLowerCase()));
  }

  function isSelected(item, selectedList) {
    return selectedList.includes(item);
  }
</script>

<style>
  .selected {
    background-color: #e5e5e5;
  }
  .customPad{
    padding: 100px 240px;
  }

</style>

<div class=" bg-white  py-12 customPad px-4" style="min-height:100vh ">
  <div class="text-2xl text-center mb-4">{$t("checkIn.title")}</div>

  <!-- Host Selection -->
  <div class="text-blacktext" style="font-size: 2rem;">{$t("title.host")}</div>
  
  <div class="mt-4 relative w-full border ring-1 ring-black ring-opacity-5">
    <SolidSearchIcon className="pointer-events-none absolute top-3 left-4 h-8 w-8 text-gray-400" />
    <input
      type="text"
      bind:value={searchValueHost}
      on:input={(e) => updateSearchHosts(e.target.value)}
      class="h-12 w-full border-0 bg-transparent pl-[4rem] pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 text-2xl mb-1"
      placeholder={$t("search.host")}
    />
  </div>
  <div class="h-[10rem] overflow-y-scroll bg-white shadow ring-1 ring-black ring-opacity-5 rounded-b-md">
    <ul class="divide-y divide-gray-200">
      {#each filteredHosts as host}
        <li
          class="cursor-pointer px-4 py-2 truncate text-2xl font-medium"
          on:click={() => selectHost(host)}
          class:selected={selectedHost === host}
        >
          {host.name}
        </li>
      {/each}
    </ul>
  </div>

  <!-- Visitor Selection -->

    <div class="mt-8">
      <div class="text-blacktext mt-4" style="font-size: 2rem;">{$t("title.visitor")}</div>
      
      <div class="mt-4 relative w-full border ring-1 ring-black ring-opacity-5">
        <SolidSearchIcon className="pointer-events-none absolute top-3 left-4 h-8 w-8 text-gray-400" />
        <input
          type="text"
          bind:value={searchValueVisitor}
          on:input={(e) => updateSearchVisitors(e.target.value)}
          class="h-12 w-full border-0 bg-transparent pl-[4rem] pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 text-2xl mb-1"
          placeholder={$t("search.visitor")}
        />
      </div>
      {#if showVisitors}
      <div class="h-[10rem] overflow-y-scroll bg-white shadow ring-1 ring-black ring-opacity-5 rounded-b-md">
        <ul class="divide-y divide-gray-200">
          {#each filteredVisitors as visitor}
            <li
              class="cursor-pointer px-4 py-2 truncate text-2xl font-medium"
              on:click={() => toggleVisitor(visitor)}
              class:selected={isSelected(visitor, selectedVisitors)}
            >
              {visitor.name}
            </li>
          {/each}
        </ul>
      </div>
 
  {/if}
</div>

  <!-- Submit Button -->
 
    <div class="mt-4">
      <button
      
      class="w-full text-dark border text-white text-2xl py-4" style="background-color: #6a29f5;"
      on:click={submitSelection}
    >
    {$t("checkin.btn")}
    </button>
    </div> 

</div>
