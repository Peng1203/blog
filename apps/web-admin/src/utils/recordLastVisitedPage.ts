import { Local } from './storage'

export const LAST_VISITED_PAGE_PATH_STORAGE_KEY = 'lastVisitedPagePath'

export const rememberLastVisitedPage = () => {
  window.addEventListener('beforeunload', e => {
    Local.set(LAST_VISITED_PAGE_PATH_STORAGE_KEY, window.location.pathname)
  })
}
