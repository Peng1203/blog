<template>
  <el-dropdown
    trigger="click"
    ref="dropdownRef"
  >
    <template #default>
      <i
        class="iconfont icon-emoji pseudo-c-p"
        style="font-size: 2rem"
      />
    </template>

    <template #dropdown>
      <div class="emoji-container">
        <ol class="emojis">
          <li
            v-for="(emoji, index) of emojis"
            :key="`emoji-${index}`"
            @click="handleEmojiItemClick(emoji)"
            v-text="emoji"
          ></li>
        </ol>
      </div>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup name="EmojiExtension">
import { useTemplateRef } from 'vue'
import { emojis } from './data'
import { DropdownInstance } from 'element-plus'

type Emits = {
  (e: 'change', emoji: string): void
}

const emits = defineEmits<Emits>()

const downRef = useTemplateRef<DropdownInstance>('dropdownRef')

const handleEmojiItemClick = (emoji: string) => {
  downRef.value?.handleClose()
  emits('change', emoji)
}
</script>

<style scoped lang="scss">
.emoji-container {
  border-radius: 3px;
  border: 1px solid #e6e6e6;
}

.emojis {
  display: grid;
  // grid-template-columns: repeat(auto-fill, minmax(28px, 1fr));
  grid-template-columns: repeat(10, 1fr);
  // gap: 1px;
  margin: 10px;
  padding: 0;
  background-color: #fff;

  li {
    cursor: pointer;
    border: 1px solid #e8e8e8;
    height: 28px;
    width: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    user-select: none;

    &:hover {
      border: 1px solid #63a35c;
    }
  }
}
</style>
