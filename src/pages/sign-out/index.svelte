<script>
	import { exampleTypes } from './../../helpers/constants.js';
  import { onMount } from "svelte";
  import { t } from "svelte-i18n";
  import Button from "$components/common/Button.svelte";
  import HostVisitorSelector from "$components/common/HostVisitorSelect.svelte";
  import Divider from "$components/common/Divider.svelte";
  import CaretLeftSolid from "$icons/SolidChevronLeftIcon.svelte";
  import { goto } from "@roxi/routify";
  import {
    postVisitorData,
    getHosts,
    getVisitorByHostIds,
    postSignOut,
  } from "$helpers/api.js";
  import Notification from "$components/common/Notification.svelte";
  let filteredHosts = [];
  let filteredVisitors = [];
  let selectedHost = null;
  let selectedVisitors = [];
  let showVisitors = false;
  let searchValueHost = "";
  let searchValueVisitor = "";
  let organizationId = localStorage.getItem("selectedOrganizationId");
  let hosts = [];
  let selectedHostId;
  let visitorsIds = [];
  let visitors = [];
  let showToast = false;
  let toastTitle = "";
  let toastMessages = [];
  let toastIcon = "success";

  // Initialize with all hosts and visitors
  filteredHosts = [...hosts];
  filteredVisitors = [...visitors];

  onMount(() => {
    getHosts(organizationId)
      .then((response) => {
        hosts = response.records; // Update the hosts with the API response
        filteredHosts = [...hosts]; // Update filteredHosts to display the fetched hosts
      })
      .catch((err) => {
        console.error(err.message);
      });
  });

  function triggerToast(title, messages, icon) {
  toastTitle = title;
  toastMessages = messages;
  toastIcon = icon;
  showToast = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
  // Automatically hide the toast after a few seconds
  setTimeout(() => {
    showToast = false;
  }, 4500);
}

  function selectHost(host) {
    selectedHost = host;
    selectedHostId = host.value;
    selectedVisitors = []; // Reset visitors on host selection
    showVisitors = true;
    searchValueVisitor = ""; // Reset visitor search input
    updateSearchVisitors("");

    getVisitorByHostIds(selectedHostId)
      .then((response) => {
        visitors = response;
        filteredVisitors = [...visitors];
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  function toggleVisitor(visitor) {
    if (selectedVisitors.includes(visitor)) {
      selectedVisitors = selectedVisitors.filter((v) => v !== visitor);
    } else {
      selectedVisitors = [...selectedVisitors, visitor];
    }
  }

  function submitSelection() {
    console.log("Selected Host:", selectedHostId);
    visitorsIds = selectedVisitors.map((visitor) => visitor.uid);
    console.log("Selected Visitors:", visitorsIds);
    const body = {
      workplaceVisitId: selectedHostId,
      uid: visitorsIds,
      signOutDateUtc: new Date().toISOString(),
    };
    const customHeader = {
      "Content-Type": "application/json",
    };

    postSignOut(body, customHeader)
      .then((response) => {
        if(response == true){
        triggerToast(
          "Success!",
          ["Visitor sign out successfully"],
          "success"
        );
        }
        else{
        triggerToast("Error!", ["Failed to register visitor"], "error");
        }
      })
      .catch((err) => {
        triggerToast("Error!", ["Failed to register visitor"], "error");
      });

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
    filteredHosts = hosts.filter((host) =>
      host.text.toLowerCase().includes(val.toLowerCase())
    );
  }

  function updateSearchVisitors(val) {
    searchValueVisitor = val;
    filteredVisitors = visitors.filter((visitor) =>
      (visitor.firstName + " " + visitor.surname)
        .toLowerCase()
        .includes(val.toLowerCase())
    );
  }

  function isSelected(item, selectedList) {
    return selectedList.includes(item);
  }
</script>

<!-- Main Container -->
<div
  class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background"
>
  <!-- Content Container (with relative positioning) -->
  <div
    class="max-w-3xl w-full min-h-[500px] sm:min-h-[400px] space-y-4 bg-white p-10 sm:p-12 lg:p-16 rounded-3xl relative"
  >
    {#if showToast}
      <Notification
        icon={toastIcon}
        title={toastTitle}
        messages={toastMessages}
      />
    {/if}
    <div class="flex cursor-pointer" on:click={$goto("/welcome")}>
      <CaretLeftSolid />
      <p>Back</p>
    </div>
    <div class="mt-3 mb-12 text-4xl font-semibold text-center">
      {$t("title.signout")}
    </div>

    <HostVisitorSelector
      title={$t("title.host")}
      searchValue={searchValueHost}
      filteredItems={filteredHosts}
      selectItem={selectHost}
      isSelected={(host) => selectedHost === host}
      placeholder={$t("search.host")}
      onSearchChange={updateSearchHosts}
    />

    {#if showVisitors && filteredVisitors.length > 0}
      <HostVisitorSelector
        title={$t("title.visitor")}
        searchValue={searchValueVisitor}
        filteredItems={filteredVisitors}
        selectItem={toggleVisitor}
        isSelected={(visitor) => isSelected(visitor, selectedVisitors)}
        placeholder={$t("search.visitor")}
        onSearchChange={updateSearchVisitors}
      />
    {:else if showVisitors}
      <p class="text-red-500 text-center mt-4">
        {$t("No visitors available.")}
      </p>
    {/if}

    <!-- Submit Button -->
    <div class="flex justify-center">
      <Button
        className="w-full"
        on:click={submitSelection}
        disabled={!selectedHost ||
          selectedVisitors.length === 0 ||
          filteredVisitors.length === 0}
      >
        {$t("signout.signoutButton")}
      </Button>
    </div>
  </div>
</div>
