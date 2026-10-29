export const SITE_URL='https://www.babuni.dev';
export const SITE_TITLE='Babuni.dev — Projects, games, music and creative development';
export const SITE_DESCRIPTION='Explore Babuni.dev’s games, World of Warcraft add-ons, music and creative experiments, with project histories and human–AI development notes.';
export const projectPath=(id:string)=>`/projects/${id}/`;
export const modulePath=(project:string,module:string)=>`${projectPath(project)}${module}/`;
