import mittBus from '@/utils/mitt'

const scriptReg = /\<script.*src=["'](?<src>[^"']+)/gm
const DURATION = 30000
let lastScriptHash = ''

const checkForUpdate = () => {
  setInterval(() => {
    if (import.meta.env.MODE === 'development') return

    if (document.hidden) return

    fetch(`/timestamp?=${Date.now()}`)
      .then(res => res.text())
      .then(res => {
        let matches
        while ((matches = scriptReg.exec(res))) {
          if ((matches.groups.src as string).includes('/assets/index')) {
            if (!lastScriptHash) lastScriptHash = matches.groups.src
            else {
              !lastScriptHash === matches.groups.src && mittBus.emit('onUpgradeOpen', true)
              lastScriptHash = matches.groups.src
            }
          }
        }
      })
  }, DURATION)
}

checkForUpdate()
