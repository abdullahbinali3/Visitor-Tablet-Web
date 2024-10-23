<script>
  import { redirect, goto, url, metatags } from "@roxi/routify";
  import { fly, fade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import user from "$stores/user-store.js";
  import appData from "$stores/app-data-store.js";
  import modals from "$stores/modals-store.js";
  import notifications from "$stores/notifications-store.js";
  //import LoadingModal from "$components/modal/LoadingModal.svelte";
  import IconModal from "$components/modal/IconModal.svelte";
  import Nav from "$components/nav/Nav.svelte";
  import Notification from "$components/common/Notification.svelte";
  $: metatags.title = $appData.pageTitle ? $appData.pageTitle + " - Visitor Tablet Portal" : "Visitor Tablet Portal";

  let darkMode = false;

  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  if (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    darkMode = true;
  } else {
    darkMode = false;
  }

  $: if (!$user.isLoggedIn) {
    $goto($url("/login"), {}, true);
  }
</script>

<!-- routify:options preload="proximity" -->
{#if $user.isLoggedIn}
  <div class:dark={darkMode}>
    <Nav>
      <slot />
    </Nav>
    {#each $modals as iconModal (IconModal.modalId)}
      {#if iconModal.icon === "loading"}
        <!-- <LoadingModal messages={iconModal.messages} title={iconModal.title} /> -->
      {:else}
        <IconModal
          icon={iconModal.icon}
          messages={iconModal.messages}
          title={iconModal.title}
          on:cancel={() => {
            modals.removeModal(iconModal.modalId);
          }}
        />
      {/if}
    {/each}
    {#if $notifications && $notifications.length > 0}
      <div class="absolute bottom-5 right-5   inset-0 flex items-end w-full flex-col px-4 py-6 sm:p-6 space-y-4 pointer-events-auto">
        {#each $notifications as notification, i (notification.notificationId)}
          <div class="w-full " in:fly={{ x: 24, duration: 300 }} out:fade={{ duration: 150 }} animate:flip={{ duration: 400 }}>
            <Notification
              pos={i}
              icon={notification.icon}
              title={notification.title}
              messages={notification.messages}
              on:cancel={() => {
                notifications.removeNotification(notification.notificationId);
              }}
            />
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}
