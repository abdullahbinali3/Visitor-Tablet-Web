<script>
  export let delay = 150;
  export let className = "h-4 w-4 block";

  // https://tobiasahlin.com/spinkit/
  let show = false;

  setTimeout(function() {
    show = true;
  }, delay);
</script>

{#if show}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    style="margin: auto; background: none; shape-rendering: auto;"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    class={className}>
    <circle
      cx="50"
      cy="50"
      fill="none"
      stroke="#6b7280"
      stroke-width="12"
      r="43.75"
      stroke-dasharray="164.93361431346415 56.97787143782138">
      <animateTransform
        attributeName="transform"
        type="rotate"
        repeatCount="indefinite"
        dur="1s"
        values="0 50 50;360 50 50"
        keyTimes="0;1" />
    </circle>
  </svg>
{/if}
