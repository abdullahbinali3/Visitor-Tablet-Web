<script>
  export let className = "h-6 w-6";
  export let classColor = "";
  export let strokeWidth = "2";
  export let nonScalingStroke = false;
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
    vector-effect={nonScalingStroke ? 'non-scaling-stroke' : ''}
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
</svg>
