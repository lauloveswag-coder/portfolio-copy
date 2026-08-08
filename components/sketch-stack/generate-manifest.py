#!/usr/bin/env python3
"""
Regenerate a sketch-stack manifest.js by scanning an image folder.

Optional convenience for adding new work: if you'd rather not hand-edit
manifest.js, drop your new images in the folder and run this script.

Usage:
    python3 generate-manifest.py "assets/projects/sketches" sketches
    python3 generate-manifest.py "assets/projects/3d-ai" 3d-ai --with-video

Args:
    folder        Path to the folder of images (relative to the project root,
                   or absolute). This is the same folder the <sketch-stack>
                   tag points to via data-folder.
    manifest-key  The data-manifest-key used by the matching <sketch-stack>
                   tag in index.html (e.g. "sketches").
    --with-video  Also list video files. Opt-in, because <sketch-stack>
                   renders every manifest entry as an <img> and would break
                   on a video — only pass this for manifests consumed by
                   renderManifestFilmstrip() in index.html, which handles
                   both (e.g. the 3d-ai gallery).

Supported formats: .jpg, .jpeg, .png, .webp, .gif
                   (+ .mp4, .webm, .mov with --with-video)
Writes <folder>/manifest.js, overwriting any existing one.
"""
import json
import os
import sys

SUPPORTED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
VIDEO_EXTENSIONS = {'.mp4', '.webm', '.mov'}


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    with_video = '--with-video' in sys.argv[1:]

    if len(args) != 2:
        print(__doc__)
        sys.exit(1)

    folder, manifest_key = args

    if not os.path.isdir(folder):
        print(f"Not a folder: {folder}")
        sys.exit(1)

    allowed = SUPPORTED_EXTENSIONS | VIDEO_EXTENSIONS if with_video else SUPPORTED_EXTENSIONS

    files = sorted(
        f for f in os.listdir(folder)
        if not f.startswith('.')
        and f != 'manifest.js'
        and os.path.splitext(f)[1].lower() in allowed
    )

    lines = ['window.STACK_MANIFESTS = window.STACK_MANIFESTS || {};']
    lines.append(f'window.STACK_MANIFESTS[{json.dumps(manifest_key)}] = [')
    for f in files:
        lines.append('  ' + json.dumps(f) + ',')
    lines.append('];')
    content = '\n'.join(lines) + '\n'

    out_path = os.path.join(folder, 'manifest.js')
    with open(out_path, 'w', encoding='utf-8') as fh:
        fh.write(content)

    print(f"Wrote {len(files)} entries to {out_path}")


if __name__ == '__main__':
    main()
