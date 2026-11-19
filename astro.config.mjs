// @ts-check
import { defineConfig } from 'astro/config';
import { MERGED_PROJECTS, CLASSIC_WOW_PROJECT, folderModuleId } from './src/lib/merged-projects.ts';

// Former project pages forward to their folder in the collection they were merged into.
const FORMER_MODULES=['overview','concept','journal','changes','architecture','design','decisions','collaboration','roadmap','content','source'];
const redirects=Object.fromEntries(Object.entries(MERGED_PROJECTS).flatMap(([id,folder])=>{
  const target=`/projects/${CLASSIC_WOW_PROJECT}/${folderModuleId(folder)}/`;
  return [[`/projects/${id}/`,target],...FORMER_MODULES.map(module=>[`/projects/${id}/${module}/`,target])];
}));

// https://astro.build/config
export default defineConfig({site:'https://www.babuni.dev',trailingSlash:'always',devToolbar:{enabled:false},redirects});
