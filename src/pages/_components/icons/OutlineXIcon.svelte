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
    d="M6 18L18 6M6 6l12 12" />
</svg>
