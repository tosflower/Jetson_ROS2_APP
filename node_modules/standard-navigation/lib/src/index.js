import * as React from 'react';
export function createStandardNavigator(NavigatorContent) {
    return {
        type: 'standard',
        version: 1,
        NavigatorContent,
    };
}
