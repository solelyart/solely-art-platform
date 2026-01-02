// Preload script to patch fs module with graceful-fs
// This must run before any other code to handle EMFILE errors
const realFs = require('fs');
const gracefulFs = require('graceful-fs');
gracefulFs.gracefulify(realFs);
console.log('[graceful-fs] File system patched to handle EMFILE errors');
