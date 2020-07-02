'use strict';

/**
 * @param {string} filename
 * @param {string} extension This extension allows chained types like .store.txt
 * @returns {boolean} Whether a filename has a specific extension.
 */
export function hasExtension(filename, extension) {
    let extensionIndex = filename.lastIndexOf(extension);

    return (extensionIndex > 0 && extensionIndex === (filename.length - extension.length));
}
