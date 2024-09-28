<script>
  export let className = "h-6 w-6";
  export let classColor = "";
  export let strokeWidth = "2";
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  class="{className}
  {classColor}"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor">
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={strokeWidth}
    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
</svg>
