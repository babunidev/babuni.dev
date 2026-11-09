"""Usage: keep-live-bundle.py <live-dir> <new-dist>
If the only difference in the main bundle is the checkedAt timestamps, keep the live
bundle and index.html so a rebuild of unchanged content reports nothing to publish."""
import glob, os, re, shutil, sys

live, new = sys.argv[1], sys.argv[2]
pattern = "_astro/index.astro_astro_type_script_index_0_lang.*.js"
a = glob.glob(os.path.join(live, pattern))
b = glob.glob(os.path.join(new, pattern))
if len(a) != 1 or len(b) != 1:
    sys.exit(0)
strip = lambda text: re.sub(r"checkedAt:`[^`]*`", "checkedAt:``", text)
read = lambda path: open(path, encoding="utf-8").read()
if strip(read(a[0])) != strip(read(b[0])):
    print("Activity data changed beyond timestamps; the new bundle will be published.")
    sys.exit(0)
live_index = read(os.path.join(live, "index.html"))
new_index = read(os.path.join(new, "index.html"))
if new_index.replace(os.path.basename(b[0]), os.path.basename(a[0])) != live_index:
    print("index.html differs beyond the bundle name; nothing adjusted.")
    sys.exit(0)
os.remove(b[0])
shutil.copy2(a[0], os.path.join(new, "_astro", os.path.basename(a[0])))
shutil.copy2(os.path.join(live, "index.html"), os.path.join(new, "index.html"))
print("Only activity timestamps differ; keeping the live bundle.")
