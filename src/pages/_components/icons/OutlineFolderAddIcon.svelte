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
  stroke="currentColor">
  <path
    vector-effect={nonScalingStroke ? 'non-scaling-stroke' : ''}
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={strokeWidth}
    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2
    2 0 01-2-2z" />
</svg>
