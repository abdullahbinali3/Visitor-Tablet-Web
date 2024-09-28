<script>
  export let delay = 150;
  export let className = null;

  // https://tobiasahlin.com/spinkit/
  let show = false;

  setTimeout(function() {
    show = true;
  }, delay);
</script>

{#if show}
  <div class="spinner {className}">
    <div class="double-bounce1" />
    <div class="double-bounce2" />
  </div>
{/if}
