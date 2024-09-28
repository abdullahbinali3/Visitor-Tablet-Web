<script>
  export let disabled = false;
  export let type = "primary";
  export let size = "sm";
  export let className = "";

  function getColorClasses(type) {
    switch (type) {
      case "primary":
        return "text-white bg-primary hover:bg-background disabled:bg-primaryinactive disabled:hover:bg-primaryinactive border-transparent";
      case "secondary":
        return "text-white bg-primaryinactive hover:bg-secondary disabled:bg-primaryinactive disabled:hover:bg-primaryinactive border-transparent";
      case "white-red":
        return "text-activered bg-white hover:bg-tableleft disabled:bg-primaryinactive disabled:hover:bg-primaryinactive border-transparent";
    }

    return "";
  }

  function getSizePadding(size) {
    switch (size) {
      case "xs":
        return "p-1";
      case "sm":
        return "p-1.5";
      case "md":
        return "p-2";
      case "lg":
        return "p-2.5";
      case "xl":
        return "p-3";
    }
  }
</script>

<button
  type="button"
  {disabled}
  class="inline-flex items-center {getSizePadding(
    size
  )} border rounded-full shadow-sm focus:outline-none {getColorClasses(
    type
  )} {className}"
  on:click>
  <slot />
</button>
