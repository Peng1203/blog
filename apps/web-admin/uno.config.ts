import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  rules: [
    [/^mg(\d+)$/, ([, d]) => ({ margin: `${d}px` })], // mg(数字)
    [/^mg(\d+)_(\d+)$/, ([, d, d2]) => ({ margin: `${d}px ${d2}px` })],
    [/^mt(\d+)$/, match => ({ 'margin-top': `${match[1]}px` })],
    [/^mr(\d+)$/, match => ({ 'margin-right': `${match[1]}px` })],
    [/^mb(\d+)$/, match => ({ 'margin-bottom': `${match[1]}px` })],
    [/^ml(\d+)$/, match => ({ 'margin-left': `${match[1]}px` })],

    [/^pd(\d+)$/, match => ({ padding: `${match[1]}px` })],
    [/^pd(\d+)_(\d+)$/, match => ({ padding: `${match[1]}px ${match[2]}px` })],
    [/^pt(\d+)$/, match => ({ 'padding-top': `${match[1]}px` })],
    [/^pr(\d+)$/, match => ({ 'padding-right': `${match[1]}px` })],
    [/^pb(\d+)$/, match => ({ 'padding-bottom': `${match[1]}px` })],
    [/^pl(\d+)$/, match => ({ 'padding-left': `${match[1]}px` })],

    [/^w([1-9]\d?|100)$/, ([, d]) => ({ width: `${d}% !important` })],
    [/^w(\d+)px$/, ([, d]) => ({ width: `${d}px !important` })],
    [/^h([1-9]\d?|100)$/, ([, d]) => ({ height: `${d}% !important` })],
    [/^h(\d+)px$/, ([, d]) => ({ height: `${d}px !important` })],
    [/^fz(\d+)$/, ([, d]) => ({ 'font-size': `${d}px` })],
    [
      'flex-c-c',
      {
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
      },
    ],
    [
      'flex-s-c',
      {
        display: 'flex',
        'justify-content': 'start',
        'align-items': 'center',
      },
    ],
    [
      'flex-e-c',
      {
        display: 'flex',
        'justify-content': 'end',
        'align-items': 'center',
      },
    ],
    [
      'flex-sa-c',
      {
        display: 'flex',
        'justify-content': 'space-around',
        'align-items': 'center',
      },
    ],
    [
      'flex-sb-c',
      {
        display: 'flex',
        'justify-content': 'space-between',
        'align-items': 'center',
      },
    ],
    [
      'flex-se-c',
      {
        display: 'flex',
        'justify-content': 'space-evenly',
        'align-items': 'center',
      },
    ],
    [/^flex(\d+)$/, match => ({ flex: `${match[1]}` })],
    // 伪光标
    [
      'pseudo-c-p',
      {
        cursor: 'pointer',
      },
    ],
    [
      'pseudo-c-p-c',
      {
        cursor: 'pointer',
        color: '#1890ff',
      },
    ],
  ],
  shortcuts: {
    btn: 'py-2 px-4 font-semibold rounded-lg',
  },
  presets: [
    presetUno(),
    presetIcons(),
    presetAttributify({
      // prefix: 'un-',
      // prefixedOnly: true,
      ignoreAttributes: [],
    }),
  ],
})
