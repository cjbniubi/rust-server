import request from '../request/index'

export function servers(params) {
  return request({
      url: '/servers',
      method: 'get',
      data: params,
  })
}


export function playerCountHistory(params,id) {
  return request({
      url: `/servers/${id}/player-count-history`,
      method: 'get',
      data: params,
  })
}