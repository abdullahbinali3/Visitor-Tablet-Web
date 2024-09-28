<script>
  import appData from "$stores/app-data-store.js";
  import { stringToPastelColor, stringToPastelTextColor, stringToPastelColorDark, stringToPastelTextColorDark } from "$helpers/colors.js";
  import { getInitials } from "$helpers/formatters.js";

  export let sizeFor = "table";
  export let rounded = "rounded-full";
  export let className = "";
  export let imageUrl = null;
  export let name;
  // export let id;

  //$: backgroundColor = $appData.darkMode ? stringToPastelColorDark(id) : stringToPastelColor(id);
  //$: textColor = $appData.darkMode ? stringToPastelTextColorDark(id) : stringToPastelTextColor(id);
  $: backgroundColor = "#A9A9A9";
  $: textColor = "#FFFFFF";
  $: initials = getInitials(name);
  $: containerSize = getContainerSize(sizeFor);
  $: containerBorder = getContainerBorder(sizeFor);
  $: textSize = getTextSize(sizeFor);

  function getContainerSize(size) {
    switch (size.toLowerCase()) {
      case "rowtext":
        return "h-5 w-5";
      case "dropdown":
        return "h-6 w-6";
      case "navbar":
        return "h-8 w-8";
      case "table":
        return "h-12 w-12";
      case "navcorner":
        return "h-24 w-24";
      case "details":
        return "h-28 w-28";
      case "sidepanel":
        return "h-24 w-24 sm:h-40 sm:w-40 lg:h-48 lg:w-48";
      case "full":
        return "h-64 w-64";
      case "imageinput":
        return "h-48 w-48 sm:h-64 sm:w-64";
    }
  }

  function getContainerBorder(size) {
    switch (size.toLowerCase()) {
      case "rowtext":
        return "";
      case "dropdown":
        return "";
      case "navbar":
        return "";
      case "table":
        return "";
      case "navcorner":
        return "";
      case "details":
        return "border";
      case "sidepanel":
        return "";
      case "full":
        return "";
      case "profile":
        return "";
    }
  }

  function getTextSize(size) {
    switch (size.toLowerCase()) {
      case "rowtext":
        return "text-xs";
      case "dropdown":
        return "text-xs";
      case "navbar":
        return "text-base";
      case "table":
        return "text-lg";
      case "navcorner":
        return "text-5xl";
      case "details":
        return "text-5xl";
      case "sidepanel":
        return "text-[4rem] sm:text-[7rem] pt-[1px] pr-[2px]";
      case "full":
        return "text-9xl";
      case "imageinput":
        return "text-8xl sm:text-9xl";
    }
  }
</script>

{#if !imageUrl}
  <div class="flex items-center">
    <span
      class="{rounded} inline-flex {containerSize} {containerBorder} {className}"
      style="background-color: {backgroundColor}; border-color: {textColor}"
    >
      <div class="flex w-full items-center justify-center pointer-events-none select-none">
        {#if $$slots.default}
          <slot />
        {:else}
          <span class="{textSize} font-medium" style="color: {textColor}">{initials}</span>
        {/if}
      </div>
    </span>
  </div>
{:else}
  <img
    class="{containerSize} {rounded} {className} select-none"
    src={`${imageUrl && imageUrl[0] === "/" ? $appData.apiUrl : ""}${imageUrl}`}
    alt=""
  />
{/if}
