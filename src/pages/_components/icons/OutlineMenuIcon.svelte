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
  stroke="currentColor"
  stroke-width={strokeWidth}>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M4 6h16M4 12h16M4 18h16" />
</svg>
