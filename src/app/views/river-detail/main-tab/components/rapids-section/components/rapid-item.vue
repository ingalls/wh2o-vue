<template>
  <div
    :class="[{'form-visible':uploadFormVisible}, 'rapid-item, bx--col-sm-12 bx--col-md-12 bx--col-lg-16 mb-sm']"
  >
    <cv-tile
      v-if="rapid"
      kind="standard"
      cv-type="standard"
      :expanded="firstPOI"
    >
      <div class="top-bar">
        <div class="title mb-spacing-xs">
          <h4 class="mb-spacing-xs">
            {{ rapid.name }}
          </h4>
          <span
            v-if="rapid.difficulty && rapid.difficulty !== 'N/A'"
            class="mr-spacing-md rapid-meta"
            v-text="`Class: ${rapid.difficulty}`"
          />
          <span
            class="rapid-meta"
            v-text="`Distance: ${rapid.distance}`"
          />
        </div>
        <rapid-icon-bar
          :character="rapid.character"
          @rapid:edit="editModalVisible = true"
          @rapid:delete="deleteModalVisible = true"
        />
      </div>
      <hr class="ui-03">
      <template>
        <div
          v-if="!uploadFormVisible"
          class="bx--row pb-md"
        >
          <div class="bx--col-sm-12 bx--col-lg-5">
            <div class="outside">
              <div
                v-if="rapid.photo && rapid.photo.image"
                class="inside thumbnail pb-spacing-sm"
              >
                <img
                  :src="
                    `https://americanwhitewater.org/${rapid.photo.image.uri.medium}`
                  "
                  :alt="rapid.name"
                >
              </div>
              <div class="inside upload-prompt">
                <cv-button
                  size="small"
                  kind="tertiary"
                  class="mb-spacing-lg"
                  @click="uploadFormVisible = true"
                >
                  Add Media
                </cv-button>
                <cv-button
                  v-if="sanitizedDescription.length > characterLimit"
                  size="small"
                  kind="tertiary"
                  class="mb-spacing-lg"
                  @click="readMoreActive = !readMoreActive"
                >
                  Show Full Description
                </cv-button>
              </div>
            </div>
          </div>
          <div class="bx--col-sm-12 bx--col-lg-11">
            <template v-if="sanitizedDescription">
              <template v-if="sanitizedDescription.length > characterLimit">
                <div
                  class="description"
                  v-html="sanitizedDescription.slice(0, characterLimit) + '...'"
                />
                <div
                  v-if="readMoreActive"
                  v-html="sanitizedDescription.slice(characterLimit, sanitizedDescription.length * 2)"
                />
              </template>
              <template v-else>
                <div
                  class="description"
                  v-html="sanitizedDescription"
                />
              </template>
            </template>
            <template v-else>
              <div class>
                <p>
                  This rapid does not have a description.
                  <br>Log in to add one.
                </p>
              </div>
            </template>
          </div>
        </div>
        <rapid-media-uploader
          v-if="uploadFormVisible"
          :rapid-id="rapid.id"
          @cancel="uploadFormVisible = false"
        />
        <rapid-edit-modal
          :visible="editModalVisible"
          :rapid-id="rapid.id"
          @edit:cancelled="editModalVisible = false"
          @edit:success="editModalVisible = false"
        />
        <confirm-delete-modal
          :visible="deleteModalVisible"
          :resource-name="rapid.name"
          @delete:cancelled="deleteModalVisible = false"
          @delete:success="deleteModalVisible = false"
          @delete:confirmed="deleteRapid"
        />
      </template>
    </cv-tile>
  </div>
</template>
<script>
import RapidIconBar from './rapid-icon-bar'
import RapidMediaUploader from './rapid-media-uploader'
import RapidEditModal from './rapid-edit-modal'
import ConfirmDeleteModal from '@/app/global/components/confirm-delete-modal/confirm-delete-modal.vue'
export default {
  name: 'rapids-item',
  components: {
    RapidIconBar,
    RapidMediaUploader,
    RapidEditModal,
    ConfirmDeleteModal
  },
  props: {
    rapid: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      default: 'grid'
    },
    firstPOI: {
      type: Boolean
    }
  },
  data: () => ({
    editModalVisible: false,
    deleteModalVisible: false,
    uploadFormVisible: false,
    showConfirmation: false,
    readMoreActive: false,
    characterLimit: 1000
  }),
  computed: {
    /**
     * @todo make this a globally available func
     *
     */
    sanitizedDescription () {
      if (this.rapid) {
        let content = this.$sanitize(this.rapid.description, {
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
    uploadMedia () {
      return 'upload media'
    },
    cancelUpload () {
      this.showConfirmation = false
      this.uploadFormVisible = false
    },
    deleteRapid () {
      this.deleteModalVisible = false
      this.$emit('woo... rapid deleted')
    }
  },
  created () {
    if (this.firstPOI) {
      this.rapidExpanded = true
    }
  }
}
</script>
<style lang="scss">
.rapid-item {
  &.form-visible {
    outline: 3px solid $brand-01;
  }
  .bx--tile {
    margin: $spacing-md 0;
    .upload-prompt {
      width: 100%;
      display: block;
    }
    .thumbnail {
      width: 100%;
      min-height: 250px;
      max-height: 250px;
      margin-bottom: 1rem;
      img {
        object-fit: cover;
        height: 250px;
        width: 100%;
        background-color: $ui-05;
      }
    }
  }

  .bx--tile--is-expanded {
    .bx--tile-content {
      .bx--tile-content__below-the-fold {
        border-top: solid 1px $ui-03;
        margin-top: $spacing-sm;
        padding-bottom: $spacing-lg;
        padding-top: 1rem;
      }
    }
  }

  .bx--tile--expandable:hover {
    background-color: darken($ui-02, 0.05);
  }
}

.rapid-meta {
  @include carbon--type-style("code-01");
}

.description {
  @include carbon--type-style("body-long-02");
}

.top-bar {
  @include carbon--breakpoint("lg") {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
