<template>
  <div>
    <a-space direction="vertical">
      <div v-for="language in languageList" :key="language.languageTag">
        <a-input
          v-model="language.languageTag"
          placeholder="语言标签"
          style="width: 25%; margin-right: 8px"
          :disabled="true"
        />
        <a-input v-model="language.message" placeholder="文本值" style="width: 60%; margin-right: 8px" />
        <a-icon
          v-if="languageList.length > 1"
          class="dynamic-delete-button"
          type="minus-circle-o"
          :disabled="languageList.length === 1"
          @click="() => remove(language)"
        />
      </div>
      <a-popover trigger="click">
        <template slot="content">
          <a-transfer
            :row-key="item => item.languageTag"
            :data-source="allLanguageList"
            :render="item => item.languageTag"
            :titles="['Source', 'Target']"
            :target-keys="langTags"
            :lazy="false"
            @change="langTagChange"
          />
        </template>
        <a-button type="dashed" style="width: 60%">
          <a-icon type="plus" />
          Add field
        </a-button>
      </a-popover>
    </a-space>
  </div>
</template>

<script>
import { supportLanguage } from '@/config/projectConfig'

const supportLanguageTags = Object.keys(supportLanguage)

export default {
  name: 'I18nDataList',
  data() {
    return {
      allLanguageList: [],
      langTags: [],
      languageList: []
    }
  },
  watch: {
    langTags() {
      let languageList = this.allLanguageList.filter(x => this.langTags.findIndex(key => key === x.languageTag) !== -1)
      this.$set(this, 'languageList', languageList)
    }
  },
  created() {
    this.resetData()
  },
  methods: {
    data() {
      return this.languageList
    },
    resetData() {
      const allLanguageList = supportLanguageTags.map(languageTag => {
        return {
          languageTag: languageTag,
          message: ''
        }
      })
      this.$set(this, 'allLanguageList', allLanguageList)
      this.$set(this, 'langTags', [...supportLanguageTags])
    },
    langTagChange(nextTargetKeys) {
      this.$set(this, 'langTags', nextTargetKeys)
    },
    remove(language) {
      let index = this.langTags.findIndex(key => key === language.languageTag)
      this.langTags.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}

.dynamic-delete-button:hover {
  color: #777;
}

.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
