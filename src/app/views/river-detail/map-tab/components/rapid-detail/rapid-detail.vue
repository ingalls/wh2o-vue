<template>
  <div
    class="bx--col-sm-12 bx--col-md-12 bx--col-lg-16 mb-sm"
  >
    <!-- TODO: can we reuse the `rapid-item.vue` component from the main tab? It doesn't quite work out of the box !-->
    <cv-tile
      kind="standard"
      cv-type="standard"
    >
      <div class="top-bar">
        <div class="title mb-spacing-xs">
          <h4 class="mb-spacing-xs">
            {{ rapidData.name }}
          </h4>
          <span
            v-if="rapidData.difficulty && rapidData.difficulty !== 'N/A'"
            class="mr-spacing-md rapid-meta"
            v-text="`Class: ${rapidData.difficulty}`"
          />
          <span
            v-if="rapidData.distance"
            class="rapid-meta"
            v-text="`Distance: ${rapidData.distance}`"
          />
        </div>
        <rapid-icon-bar
          :character="rapidData.character"
        />
      </div>
      <div
        v-if="rapidData.photo && rapidData.photo.image"
        class="inside thumbnail pb-spacing-sm"
      >
        <img
          :src="
            `https://americanwhitewater.org/${rapidData.photo.image.uri.medium}`
          "
          :alt="rapidData.name"
        >
      </div>
      <hr class="ui-03">
      <div class="bx--col-sm-12">
        <template v-if="sanitizedDescription">
          <div
            class="description"
            v-html="sanitizedDescription"
          />
        </template>
        <template v-else>
          <div class>
            <p>
              This rapid does not have a description.
            </p>
          </div>
        </template>
      </div>
    </cv-tile>
  </div>
</template>

<script>
import { RapidIconBar } from '../../../main-tab/components/rapids-section/components'
import { mapState } from 'vuex'

export default {
  name: 'rapid-detail',
  components: {
    RapidIconBar
  },
  props: {
    rapid: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    characterLimit: 1000
  }),
  computed: {
    imageUrl () {
      // TODO: cannot be using images from drewalthage.com even though that's what's being used on AW site...
      return this.rapid.photoid ? `/photos/archive/medium/${this.rapid.photoid}.jpg` : 'http://drewalthage.com/client/americanwhitewater/img/no-media.png'
    },
    ...mapState({
      loading: state => state.riverDetailState.rapidsData.loading,
      error: state => state.riverDetailState.rapidsData.error,
      rapids: state => state.riverDetailState.rapidsData.data
    }),
    /*
     * Relying on the tileserver for feature info means maintaining consistency between
     * the tileserver and the GraphQL API. What I'm doing here is falling back to the
     * tileserver features, but fetching rapids from the API and using that data when it's
     * available instead.
     * */
    rapidData () {
      let rapid
      if (this.rapids) {
        rapid = this.rapids.find((r) => Number(r.id) === this.rapid.id)
      }
      return rapid || this.rapid
    },
    sanitizedDescription () {
      if (this.rapidData) {
        let content = this.$sanitize(this.rapidData.description, {
          disallowedAttributes: {
            '*': ['style']
          }
        })

        content = this.$replaceText(content, '\n\n', '<br/><br/>')
        content = this.$replaceText(content, '\n', '')
        content = this.$replaceText(content, '\r', '')
        content = this.$replaceText(content, '\t', '')

        const legacyUrl = 'http://www.americanwhitewater.org/rivers/id/'
        const updatedUrl = '/#/river-detail/'

        content = this.$replaceText(content, legacyUrl, updatedUrl)

        return content
      }
      return null
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.description-unavailable {
  color: #cdd1d4;
}
</style>
