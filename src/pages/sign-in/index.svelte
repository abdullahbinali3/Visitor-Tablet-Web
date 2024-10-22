<script>

  import { onMount } from 'svelte';
  import { t } from "svelte-i18n";
  import Button from "$components/common/Button.svelte";
  import HostVisitorSelector from "$components/common/HostVisitorSelect.svelte";
  import Divider from "$components/common/Divider.svelte";
  import CaretLeftSolid from "$icons/SolidChevronLeftIcon.svelte";
  import { goto } from "@roxi/routify";
  import { postVisitorData, getHosts, getVisitorByHostIds, postSignIn } from "$helpers/api.js";
  import Notification from "$components/common/Notification.svelte";
  import notificationStore from "$stores/notifications-store.js"; // Adjust the import path as necessary
  import {triggerToast } from "$helpers/toast.js";

  
  // State variables for managing host and visitor selection
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
  let toastMessages = "";
  let toastIcon = "success";
   
  // Set up filtered hosts and visitors on initialization
  filteredHosts = [...hosts];
  filteredVisitors = [...visitors];

  // Fetch hosts data when component is mounted
  onMount(() => {
    getHosts(organizationId)
      .then((response) => {
        hosts = response.records;
        filteredHosts = [...hosts];
      })
      .catch((err) => {
        console.error(err.message);
      });
  });

  

  // Select a host and fetch associated visitors
  function selectHost(host) {
    selectedHost = host;
    selectedHostId = host.value;
    selectedVisitors = [];
    showVisitors = true;
    searchValueVisitor = "";
    updateSearchVisitors("");

    // Fetch visitors related to the selected host
    getVisitorByHostIds(selectedHostId)
      .then((response) => {
        visitors = response;
        filteredVisitors = [...visitors];
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  // Toggle visitor selection
  function toggleVisitor(visitor) {
    if (selectedVisitors.includes(visitor)) {
      selectedVisitors = selectedVisitors.filter(v => v !== visitor);
    } else {
      selectedVisitors = [...selectedVisitors, visitor];
    }
  }

  // Submit selected host and visitors data
  function submitSelection() {
    visitorsIds = selectedVisitors.map(visitor => visitor.uid);
    const body = {
      hostUid: selectedHostId,
      uid: visitorsIds,
      signInDate: new Date().toISOString()
    };
    const customHeader = { "Content-Type": "application/json" };

    postSignIn(body, customHeader)
      .then((response) => {
        if(response == true){
          triggerToast("Success!", ["Visitor sign in successfully"], "success");
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

  // Reset form fields and state
  function resetForm() {
    selectedHost = null;
    selectedVisitors = [];
    searchValueHost = "";
    searchValueVisitor = "";
    filteredHosts = [...hosts];
    filteredVisitors = [...visitors];
    showVisitors = false;
  }

  // Filter hosts based on search input
  function updateSearchHosts(val) {
    searchValueHost = val;
    filteredHosts = hosts.filter(host => host.text.toLowerCase().includes(val.toLowerCase()));
  }

  // Filter visitors based on search input
  function updateSearchVisitors(val) {
    searchValueVisitor = val;
    filteredVisitors = visitors.filter(visitor => 
      (visitor.firstName + " " + visitor.surname).toLowerCase().includes(val.toLowerCase())
    );
  }

  // Check if an item is in the selected list
  function isSelected(item, selectedList) {
    return selectedList.includes(item);
  }
</script>

<!-- Main Container for the sign-in form -->
<div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
  <div class="max-w-3xl w-full min-h-[500px] sm:min-h-[400px] space-y-4 bg-white p-10 sm:p-12 lg:p-16 rounded-3xl relative">
    <!-- Notification for success or error messages -->
   
    {#if showToast}
    <Notification
      icon={toastIcon}
      title={toastTitle}
      messages={toastMessages}
    />
    {/if}

    <!-- Back button navigation -->
    <div class="flex cursor-pointer" on:click={$goto("/welcome")}>
      <CaretLeftSolid />
      <p>Back</p>
    </div>

    <!-- Page title -->
    <div class="mt-3 mb-12 text-4xl font-semibold text-center">{$t("title.signin")}</div>

    <!-- Host selection component -->
    <HostVisitorSelector 
      title={$t("title.host")} 
      searchValue={searchValueHost} 
      filteredItems={filteredHosts} 
      selectItem={selectHost} 
      isSelected={(host) => selectedHost === host}
      placeholder={$t("search.host")} 
      onSearchChange={updateSearchHosts} 
    />

    <!-- Visitor selection component, shown only if visitors are available -->
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
        disabled={!selectedHost || selectedVisitors.length === 0 || filteredVisitors.length === 0}
      >
        {$t("signin.signinButton")}
      </Button>
    </div>

    <!-- Divider between sections -->
    <Divider />

    <!-- Option to sign in with QR code -->
    <div class="flex justify-center">
      <Button type="simple" className="w-full sm:w-auto py-3 sm:py-4 text-lg mt-5">
        {$t("signin.qrButton")}
      </Button>
    </div>
  </div>
</div>
