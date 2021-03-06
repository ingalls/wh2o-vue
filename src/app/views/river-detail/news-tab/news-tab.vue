<template>
  <div class="news-tab">
    <layout
      name="layout-full-width"
      class="mb-lg"
    >
      <template #main>
        <hr>
        <h2 class="mb-spacing-md">
          Alerts
        </h2>
        <cv-button
          class="mb-spacing-md"
          size="small"
          :disabled="alertsLoading"
          @click.exact="initiatePostUpdate()"
          @keydown.enter="initiatePostUpdate()"
        >
          New Alert
        </cv-button>
        <template v-if="alertsLoading">
          <utility-block
            class="alerts-loading"
            state="loading"
            text="loading alerts"
          />
        </template>
        <template v-else-if="alerts && alerts.length > 0">
          <div class="bx--row">
            <div
              v-for="(alert, index) in alerts"
              :key="index"
              class="bx--col-sm-12 bx--col-lg-8 mb-spacing-md"
            >
              <cv-tile>
                <div class="alert-wrapper">
                  <header class="bx--row">
                    <div class="bx--col-sm-12 bx--col-md-8 mb-spacing-md">
                      <h3
                        v-if="alert.title"
                        class="mb-spacing-2xs"
                        v-text="alert.title"
                      />
                      <h3
                        v-else
                        class="mb-spacing-2xs"
                      >
                        Untitled
                      </h3>
                      <h6>
                        {{ formatDate(alert.post_date, "ll") }}
                        <template v-if="alert.user">
                          - {{ alert.user.uname }}
                        </template>
                      </h6>
                    </div>
                    <div class="bx--col">
                      <cv-button
                        v-if="canEdit(alert)"
                        size="small"
                        kind="secondary"
                        @click.exact="initiatePostUpdate(alert.id)"
                        @keydown.enter="initiatePostUpdate(alert.id)"
                      >
                        Edit
                      </cv-button>
                      <cv-button
                        v-if="canEdit(alert)"
                        size="small"
                        kind="danger"
                        @click.exact="initiateAlertDelete(alert.id)"
                        @keydown.enter="initiateAlertDelete(alert.id)"
                      >
                        Delete
                      </cv-button>
                    </div>
                  </header>
                  <hr>
                  <main class="alert-detail">
                    <p
                      v-if="alert.detail"
                      v-text="alert.detail"
                    />
                    <p v-else>
                      This alert has no message
                    </p>
                  </main>
                  <!-- <footer>
                    <cv-button size="small" kind="tertiary" >Share Alert</cv-button>
                  </footer> -->
                </div>
              </cv-tile>
            </div>
          </div>
        </template>
        <template v-else>
          <utility-block
            class="alerts-empty"
            state="content"
            text="No alerts"
          />
        </template>
      </template>
    </layout>

    <layout name="layout-full-width">
      <template #main>
        <section class="map-tab">
          <div class="articles">
            <hr>
            <h2 class="mb-spacing-sm">
              Articles
            </h2>
            <div v-if="articlesLoading">
              <utility-block
                class="articles-loading"
                state="loading"
                text="loading articles"
              />
            </div>
            <div v-else-if="articles">
              <div class="bx--row">
                <div
                  v-for="(article, index) in articles"
                  :key="index"
                  class="bx--col-sm-12 bx--col-md-8 bx--col-lg-8 bx--col-max-6 mb-spacing-lg"
                >
                  <ArticleCard
                    :title="$titleCase(article.title)"
                    :article-class="article.id"
                    :article-id="article.id"
                    :author="article.author"
                    :read-time="estReadingTime(article.contents)"
                  />
                </div>
              </div>
            </div>
            <div v-else>
              <utility-block
                class="articles-empty"
                state="content"
                text="no articles"
              />
            </div>
          </div>
        </section>
      </template>
    </layout>
    <post-update-modal
      :post="activeAlert"
      :visible="postUpdateModalVisible"
      :title="updateModalTitle"
      kind="WARNING"
      :reach-id="$route.params.id"
      @update:submitted="postUpdateModalVisible = false"
      @update:success="handleUpdateSuccess"
      @update:cancelled="postUpdateModalVisible = false"
    >
      <template #form-fields="formData">
        <cv-text-input
          ref="title"
          v-model="formData.formData.post.title"
          class="mb-spacing-md"
          label="Title"
        />
        <cv-text-area
          v-model="formData.formData.post.detail"
          label="Message"
          theme="light"
          class="mb-spacing-md"
        />
      </template>
    </post-update-modal>
    <confirm-delete-modal
      :visible="deleteModalVisible"
      :resource-name="deleteTitle"
      @delete:cancelled="deleteCancelled"
      @delete:success="deleteModalVisible = false"
      @delete:confirmed="deleteAlert"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { newsTabActions, alertsActions } from '../shared/state'
import UtilityBlock from '@/app/global/components/utility-block/utility-block'
import { Layout } from '@/app/global/layout'
import {
  ArticleCard,
  ConfirmDeleteModal,
  PostUpdateModal
} from '@/app/global/components'
import { httpClient } from '@/app/global/services'
import { globalAppActions } from '@/app/global/state'
export default {
  name: 'news-tab',
  components: {
    UtilityBlock,
    Layout,
    ArticleCard,
    ConfirmDeleteModal,
    PostUpdateModal
  },
  data: () => ({
    updateModalTitle: 'New Alert',
    successToastTitle: 'Alert Submitted',
    postUpdateModalVisible: false,
    deleteModalVisible: false,
    activeAlertId: ''
  }),
  computed: {
    ...mapState({
      articlesLoading: state => state.riverDetailState.newsTabData.loading,
      articlesError: state => state.riverDetailState.newsTabData.error,
      articles: state => state.riverDetailState.newsTabData.data,
      alertsLoading: state => state.riverDetailState.alertsData.loading,
      alertsError: state => state.riverDetailState.alertsData.error,
      alerts: state => state.riverDetailState.alertsData.data,
      user: state => state.userState.userData.data
    }),
    activeAlert () {
      if (this.activeAlertId) {
        return this.alerts.find(a => a.id === this.activeAlertId)
      }
      return null
    },
    deleteTitle () {
      return this.activeAlert?.title || 'Untitled Alert'
    }
  },
  methods: {
    initiatePostUpdate (alertId) {
      if (this.user) {
        this.updateModalTitle = alertId ? 'Edit Alert' : 'New Alert'
        this.successToastTitle = alertId ? 'Alert Revised' : 'Alert Submitted'
        this.activeAlertId = alertId || null
        this.postUpdateModalVisible = true
      }
    },
    /**
     * @todo or if admin
     */
    canEdit (alert) {
      return this.user?.uid === alert.user?.uid
    },
    handleUpdateSuccess () {
      this.postUpdateModalVisible = false
      this.$store.dispatch(globalAppActions.SEND_TOAST, {
        title: this.successToastTitle,
        kind: 'success',
        override: true,
        contrast: false,
        action: false,
        autoHide: true
      })
      this.$store.dispatch(
        alertsActions.FETCH_ALERTS_DATA,
        this.$route.params.id
      )
    },
    initiateAlertDelete (alertId) {
      this.activeAlertId = alertId
      this.deleteModalVisible = true
    },
    deleteCancelled () {
      this.activeAlertId = null
      this.deleteModalVisible = false
    },
    deleteAlert () {
      this.deleteModalVisible = false
      httpClient
        .post('/graphql', {
          query: `
          mutation ($id:ID!) {
            postDelete(id: $id)  {
            id
          }
        }`,
          variables: {
            id: this.activeAlertId
          }
        })
        .then(r => {
          if (!r.errors) {
            this.$store.dispatch(globalAppActions.SEND_TOAST, {
              title: 'Alert Deleted',
              kind: 'success',
              override: true,
              contrast: false,
              action: false,
              autoHide: true
            })
            this.$store.dispatch(
              alertsActions.FETCH_ALERTS_DATA,
              this.$route.params.id
            )
          }
        })
        .catch(e => {
          // eslint-disable-next-line no-console
          console.log('e :', e)
        })
    },
    loadData () {
      if (!this.articles) {
        this.$store.dispatch(
          newsTabActions.FETCH_NEWS_TAB_DATA,
          this.$route.params.id
        )
      }

      if (!this.alerts) {
        this.$store.dispatch(
          alertsActions.FETCH_ALERTS_DATA,
          this.$route.params.id
        )
      }
    }
  },
  created () {
    this.loadData()
  }
}
</script>
<style lang="scss" scoped>
.news-tab {
  padding-top: 2rem;
  .alert-wrapper {
    min-height: 250px;
    height: auto;
    position: relative;
    .alert-detail {
      overflow-y: scroll;
      @include carbon--breakpoint("sm") {
        max-height: 325px;
      }
    }
    footer {
      padding-top:1rem;
    }
  }
}
</style>
