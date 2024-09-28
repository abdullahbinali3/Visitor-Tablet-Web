<script>
  export let className = "";
  export let bgColor = "bg-white";
</script>

<div class="{bgColor} p-8 rounded-3xl {className}">
  <slot />
</div>
