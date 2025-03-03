import { Injectable } from '@nestjs/common'
import IP2Region from 'ip2region'
import NodeIP2Region from 'node-ip2region'
import path from 'path'

@Injectable()
export class IpService {
  private query: IP2Region
  private searcher: NodeIP2Region

  constructor() {
    const IPV4_DB_1 = path.resolve(process.cwd(), 'db', 'ip2region.db')
    const IPV4_DB_2 = path.resolve(process.cwd(), 'db', 'ip_2region.db')

    this.query = new IP2Region({ disableIpv6: true, ipv4db: IPV4_DB_1 })
    this.searcher = NodeIP2Region.create(IPV4_DB_2)
  }

  resolveIp(ip: string): {
    country: string
    province: string
    city: string
    isp: string
  } {
    try {
      return this.query.search(ip)
    } catch (e) {
      console.log('解析IP失败', e)
    }
  }

  resolveIp_v2(ip: string): { city: number; region: string } {
    return this.searcher.binarySearchSync(ip)
  }
}
