/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
const updateSelected = (id) => {
  const tabs = document.getElementsByClassName('tabs')
  const methods = document.getElementsByClassName('method')

  for (let i = 0; i < tabs.length; i++) {
    tabs[i].id === id
      ? tabs[i].classList.add('highlighted')
      : tabs[i].classList.remove('highlighted')
  }

  for (let i = 0; i < methods.length; i++) {
    methods[i].id === id
      ? methods[i].classList.remove('hidden')
      : methods[i].classList.add('hidden')
  }
}
