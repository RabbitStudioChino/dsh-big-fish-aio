import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

test('长期记忆页面移除旧QQ隔离和迁移入口', async () => {
  const d={ok:true,sessions:[],policy:{},spec:[],qqIsolatedGroups:['20001']}
  let index=0,render,plugin;const requests=[]
  const React={createElement:(type,props,...children)=>({type,props,children}),useState:init=>[index++===0?d:index===4?{}:init,()=>{}],useCallback:fn=>fn,useEffect(){},useRef:value=>({current:value})}
  const slots={inject:(_,fn)=>fn(),register:(_,fn)=>{render=fn}}
  vm.runInNewContext(readFileSync(new URL('../lib/client.js',import.meta.url),'utf8'),{window:{__ModuleLoader__:{load:({factory})=>{plugin=factory(()=>React)}}},fetch:async(url,options)=>{requests.push([url,options]);return{json:async()=>({ok:true})}}})
  plugin.apply({get:()=>slots})
  const Section=render().children[1].type,tree=Section({page:'数据管理'})
  const nodes=[];function visit(x){if(!x||typeof x!=='object')return;nodes.push(x);for(const c of x.children||[])Array.isArray(c)?c.forEach(visit):visit(c)}visit(tree)
  assert.equal(nodes.some(x=>x.props?.['aria-label']==='主人 QQ'),false)
  assert.equal(nodes.some(x=>x.props?.['aria-label']==='隔离群号'),false)
  assert.equal(nodes.some(x=>x.children?.includes('预览旧数据迁移')),false)
  assert.equal(requests.length,0)
})
