<script>
	import Alert from './Alert.svelte';
  import { onDestroy, createEventDispatcher } from "svelte";
  import { t } from "svelte-i18n";
  import { parseApiErrorParameter } from "$helpers/validation.js";
  import SolidCheckCircleIcon from "$components/heroicons/SolidCheckCircleIcon.svelte";
  import SolidXCircleIcon from "$components/heroicons/SolidXCircleIcon.svelte";
  import SolidInformationCircleIcon from "$components/heroicons/SolidInformationCircleIcon.svelte";
  import SolidExclamationTriangleIcon from "$components/heroicons/SolidExclamationTriangleIcon.svelte";
  import MiniXMarkIcon from "$components/heroicons/MiniXMarkIcon.svelte";

  export let icon = "";
  export let title = "";
  export let messages = [];
  export let pre = true;

  const dispatch = createEventDispatcher();

  let json;
  let jsonObjectEntries;
  let multipleJsonEntries = false;

  $: try {
    if (typeof messages === "string") {
      json = JSON.parse(messages);
    } else if (Array.isArray(messages) && messages.length === 1) {
      if (typeof messages[0] === "object" && !Array.isArray(messages[0]) && messages[0] !== null) {
        json = messages[0];
      }
    }
    jsonObjectEntries = Object.entries(json);

    if (jsonObjectEntries.length > 1) {
      multipleJsonEntries = true;
    } else if (jsonObjectEntries.length == 1 && jsonObjectEntries[0][1].length > 1) {
      multipleJsonEntries = true;
    } else {
      multipleJsonEntries = false;
    }
  } catch {
    json = null;
    jsonObjectEntries = null;
  }

  function closeModal() {  
    if (timeout) {
      clearTimeout(timeout);
    }
    
    dispatch("cancel");
  }

  onDestroy(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
  });

  let timeout = setTimeout(closeModal, 4500);

  $: containerColor = getContainerColor(icon);

  function getContainerColor(icon) {
    switch (icon) {
      case "success":
        return "dark:bg-green-700 shadow-green-500/30";
      case "error":
      case "danger":
        return "dark:bg-red-700 shadow-red-500/30";
      case "info":
        return "dark:bg-cyan-700 shadow-sky-500/30";
      case "warning":
        return "dark:bg-amber-700 shadow-amber-500/30";
      default:
        return "bg-white";
    }
  }
</script>

<!-- This example requires Tailwind CSS v2.0+ -->
<!-- Global notification live region, render this permanently at the end of the document -->
<!-- Adjust the outermost container to take up the full width -->
<div aria-live="assertive" class="w-full pointer-events-auto mb-5  sm:items-start">
  <div class="w-full flex py-12 justify-center  items-center mb-12 space-y-4  sm:items-end">
    <!-- Notification panel -->
    <div class="{containerColor} w-full lg:w-1/2 mt-0 max-w-screen-lg bg-white shadow-lg rounded-lg  ring-1 ring-black ring-opacity-5 overflow-hidden">
      <div class="p-4">
        <div class="flex items-start">
          {#if icon}
            <div class="flex-shrink-0">
              {#if icon === "success"}
                <SolidCheckCircleIcon classColor="text-green-400 dark:text-green-300" />
              {:else if icon === "error" || icon === "danger"}
                <SolidXCircleIcon classColor="text-red-400 dark:text-red-300" />
              {:else if icon === "info"}
                <SolidInformationCircleIcon className="text-sky-400 dark:text-cyan-300" />
              {:else if icon === "warning"}
                <SolidExclamationTriangleIcon classColor="text-amber-400 dark:text-amber-300" />
              {/if}
            </div>
          {/if}
          <div class="text-sm ml-3 w-0 flex-1 pt-0.5 space-y-1 text-gray-500 dark:text-zinc-200">
            {#if title}
              <p class="font-medium text-gray-900 dark:text-white">{$t(title)}</p>
            {:else if (icon === "danger" || icon === "error") && ((Array.isArray(messages) && messages.length > 1) || (json !== null && multipleJsonEntries))}
              <p class="font-medium text-gray-900 dark:text-white pb-1">{$t("error.followingErrorsOccurred")}</p>
            {/if}
            <!-- Displaying messages -->
            {#if messages === undefined && (icon === "error" || icon === "danger")}
              <p class:pre-whitespace={pre}>{$t("error.unknown")}</p>
            {:else if json !== null && jsonObjectEntries.length === 1 && jsonObjectEntries[0][1].length === 1}
              <p class:pre-whitespace={pre}>
                {$t(parseApiErrorParameter(jsonObjectEntries[0][1][0]).errorCode, parseApiErrorParameter(jsonObjectEntries[0][1][0]).params)}
              </p>
            {:else if json !== null}
              <ul class="list-disc pl-7 space-y-1">
                {#each Object.entries(json) as [fieldName, errorArray]}
                  {#each errorArray as errorItem}
                    <li class:pre-whitespace={pre}>
                      {$t(parseApiErrorParameter(errorItem).errorCode, parseApiErrorParameter(errorItem).params)}
                    </li>
                  {/each}
                {/each}
              </ul>
            {:else if typeof messages === "string"}
              <p class:pre-whitespace={pre}>{messages}</p>
            {:else if Array.isArray(messages) && messages.length == 1}
              <p class:pre-whitespace={pre}>{messages[0]}</p>
            {:else if Array.isArray(messages)}
              <div class="text-left">
                <ul class="list-disc pl-7">
                  {#each messages as message}
                    {#if typeof message === "string"}
                      <li class:pre-whitespace={pre}>{message}</li>
                    {:else if typeof message === "object"}
                      <li>
                        <b>{message.fieldName}:</b>
                        <span class:pre-whitespace={pre}>{message.message}</span>
                      </li>
                    {/if}
                  {/each}
                </ul>
              </div>
            {:else if messages !== undefined && messages !== null && typeof messages === "object"}
              <p class:pre-whitespace={pre}>{messages.toString()}</p>
            {/if}
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              on:click={closeModal}
              type="button"
              class="rounded-md inline-flex text-gray-400 hover:text-gray-500 dark:text-zinc-200 dark:hover:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-transparent"
            >
              <span class="sr-only">{$t("close")}</span>
              <MiniXMarkIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

