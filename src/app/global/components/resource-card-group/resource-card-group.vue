<template>
  <div class="bx--col-sm-12 bx--col-lg-14">
    <div class="bx--row resource-card-group">
      <div class="bx--no-gutter bx--col-md-4 bx--col-lg-8">
        <slot name="cardOne" />
      </div>
      <div class="bx--no-gutter bx--col-md-4 bx--col-lg-8">
        <slot name="cardTwo" />
      </div>
      <div class="bx--no-gutter bx--col-md-4 bx--col-lg-8">
        <slot name="cardThree" />
      </div>
      <div class="bx--no-gutter bx--col-md-4 bx--col-lg-8">
        <slot name="cardFour" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'resource-card-group'
}
</script>

<style>

</style>
