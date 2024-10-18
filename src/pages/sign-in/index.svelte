<script>
  import { t } from "svelte-i18n";
  import Button from "$components/common/Button.svelte";
  import HostVisitorSelector from "$components/common/HostVisitorSelect.svelte";
  import Divider from "$components/common/Divider.svelte";
  import CaretLeftSolid from "$icons/SolidChevronLeftIcon.svelte";
  import { goto } from "@roxi/routify";
  let filteredHosts = [];
  let filteredVisitors = [];
  let selectedHost = null;
  let selectedVisitors = [];
  let showVisitors = false;
  let searchValueHost = "";
  let searchValueVisitor = "";

  let hosts = [
    { id: 1, name: "Host 1" },
    { id: 2, name: "Host 2" },
    { id: 3, name: "Host 3" },
    { id: 4, name: "Host 4" },
    { id: 5, name: "Host 5" },
  ];

  let visitors = [
    { id: 1, name: "Visitor 1" },
    { id: 2, name: "Visitor 2" },
    { id: 3, name: "Visitor 3" },
    { id: 4, name: "Visitor 4" },
    { id: 5, name: "Visitor 5" },
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

<!-- Main Container -->
<div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
  <!-- Content Container (with relative positioning) -->
  <div class="max-w-3xl w-full min-h-[500px] sm:min-h-[400px] space-y-4 bg-white p-10 sm:p-12 lg:p-16 rounded-3xl relative">
    <div class="flex cursor-pointer" on:click={$goto("/welcome")}>
      <CaretLeftSolid />
      <p>Back</p>
        </div>
  <div class="mt-3 mb-12 text-4xl font-semibold text-center">{$t("title.signin")}</div>



  <HostVisitorSelector 
  title={$t("title.host")} 
  searchValue={searchValueHost} 
  filteredItems={filteredHosts} 
  selectItem={selectHost} 
  isSelected={(host) => selectedHost === host}
  placeholder={$t("search.host")} 
  onSearchChange={updateSearchHosts} 
/>

{#if showVisitors}
  <HostVisitorSelector 
    title={$t("title.visitor")} 
    searchValue={searchValueVisitor} 
    filteredItems={filteredVisitors} 
    selectItem={toggleVisitor} 
    isSelected={(visitor) => isSelected(visitor, selectedVisitors)}
    placeholder={$t("search.visitor")} 
    onSearchChange={updateSearchVisitors}
  />
{/if}


  <!-- Submit Button -->
  <div class="flex justify-center">
    <Button
      className="w-full"
      on:click={submitSelection}
    >
      {$t("signin.signinButton")}
    </Button>
  </div>

  <!-- Or Divider -->
  <Divider />

  <!-- Sign in with QR Code Button -->
  <div class="flex justify-center">
  <Button type="simple" className="w-full sm:w-auto py-3 sm:py-4 text-lg mt-5">
    {$t("signin.qrButton")}
  </Button>
</div>
</div>
</div>
