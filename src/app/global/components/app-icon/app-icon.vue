<template>
  <span class="">
    <template v-if="tip">
      <cv-tooltip :tip="tip">
        <i
          class="app-icon"
          :style="`color: ${color}`"
        >
          <component
            :is="name"
            :title="title"
          />
        </i>
      </cv-tooltip>

    </template>
    <template v-else>
      <i class="app-icon">
        <component
          :is="name"
          :title="title"
        />
      </i>
    </template>
  </span>
</template>

<script>
import { surf, waterfall } from './icon-set'
export default {
  name: 'app-icon',
  components: {
    surf,
    waterfall
  },
  props: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false
    },
    tip: {
      type: String,
      required: false
    },
    color: {
      type: String,
      required: false
    }
  }
}
</script>
