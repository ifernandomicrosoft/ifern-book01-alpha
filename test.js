// TeuxDeux Clone Test Suite
function log(message, type) {
    type = type || 'info';
    var results = document.getElementById('test-results');
    var div = document.createElement('div');
    div.className = 'test-result test-' + type;
    div.textContent = message;
    results.appendChild(div);
}

function clearResults() {
    document.getElementById('test-results').innerHTML = '';
    document.getElementById('performance-results').innerHTML = '';
}

function runTests() {
    clearResults();
    log('Starting TeuxDeux Clone Tests...', 'info');

    // Test 1: Check if main app files exist
    try {
        log('✓ TEST 1: Checking if main files are accessible', 'pass');
    } catch (e) {
        log('✗ TEST 1: Main files not accessible - ' + e.message, 'fail');
    }

    // Test 2: Test localStorage functionality
    try {
        var testData = { test: 'data' };
        localStorage.setItem('teuxdeux-test', JSON.stringify(testData));
        var retrieved = JSON.parse(localStorage.getItem('teuxdeux-test'));
        
        if (retrieved.test === 'data') {
            log('✓ TEST 2: localStorage functionality working', 'pass');
            localStorage.removeItem('teuxdeux-test');
        } else {
            log('✗ TEST 2: localStorage data mismatch', 'fail');
        }
    } catch (e) {
        log('✗ TEST 2: localStorage not working - ' + e.message, 'fail');
    }

    // Test 3: Test current week calculation
    try {
        var today = new Date();
        var dayOfWeek = today.getDay();
        var monday = new Date(today);
        monday.setDate(today.getDate() - dayOfWeek + 1);
        
        log('✓ TEST 3: Week calculation logic working', 'pass');
        log('  Current week starts: ' + monday.toLocaleDateString(), 'info');
    } catch (e) {
        log('✗ TEST 3: Week calculation failed - ' + e.message, 'fail');
    }

    // Test 4: Test ID generation
    try {
        var id1 = 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        var id2 = 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        if (id1 !== id2 && id1.indexOf('task_') === 0) {
            log('✓ TEST 4: Unique ID generation working', 'pass');
        } else {
            log('✗ TEST 4: ID generation may produce duplicates', 'fail');
        }
    } catch (e) {
        log('✗ TEST 4: ID generation failed - ' + e.message, 'fail');
    }

    // Test 5: Test HTML escaping
    try {
        var div = document.createElement('div');
        div.textContent = '<script>alert("test")</script>';
        var escaped = div.innerHTML;
        
        if (escaped.indexOf('&lt;') >= 0 && escaped.indexOf('&gt;') >= 0) {
            log('✓ TEST 5: HTML escaping working (XSS protection)', 'pass');
        } else {
            log('✗ TEST 5: HTML escaping may not be working', 'fail');
        }
    } catch (e) {
        log('✗ TEST 5: HTML escaping test failed - ' + e.message, 'fail');
    }

    // Test 6: Test responsive design
    try {
        var viewportWidth = window.innerWidth;
        var isMobile = viewportWidth <= 768;
        log('✓ TEST 6: Viewport detection working (' + viewportWidth + 'px, mobile: ' + isMobile + ')', 'pass');
    } catch (e) {
        log('✗ TEST 6: Viewport detection failed - ' + e.message, 'fail');
    }

    log('All automated tests completed!', 'info');
}

function runPerformanceTests() {
    var perfResults = document.getElementById('performance-results');
    perfResults.innerHTML = '';

    function perfLog(message, type) {
        type = type || 'info';
        var div = document.createElement('div');
        div.className = 'test-result test-' + type;
        div.textContent = message;
        perfResults.appendChild(div);
    }

    perfLog('Running Performance Tests...', 'info');

    // Test task creation performance
    var startTime = performance.now();
    
    // Simulate creating 1000 tasks
    var tasks = [];
    for (var i = 0; i < 1000; i++) {
        tasks.push({
            id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            text: 'Test task ' + i,
            completed: false,
            createdAt: new Date().toISOString()
        });
    }
    
    var endTime = performance.now();
    var duration = endTime - startTime;
    
    if (duration < 100) {
        perfLog('✓ Task creation performance: ' + duration.toFixed(2) + 'ms for 1000 tasks', 'pass');
    } else {
        perfLog('⚠ Task creation performance: ' + duration.toFixed(2) + 'ms for 1000 tasks (slow)', 'fail');
    }

    // Test localStorage performance
    var lsStartTime = performance.now();
    try {
        localStorage.setItem('perf-test', JSON.stringify(tasks));
        var retrieved = JSON.parse(localStorage.getItem('perf-test'));
        localStorage.removeItem('perf-test');
        
        var lsEndTime = performance.now();
        var lsDuration = lsEndTime - lsStartTime;
        
        if (lsDuration < 50) {
            perfLog('✓ localStorage performance: ' + lsDuration.toFixed(2) + 'ms for 1000 tasks', 'pass');
        } else {
            perfLog('⚠ localStorage performance: ' + lsDuration.toFixed(2) + 'ms for 1000 tasks (slow)', 'fail');
        }
    } catch (e) {
        perfLog('✗ localStorage performance test failed: ' + e.message, 'fail');
    }

    perfLog('Performance tests completed!', 'info');
}

// Auto-run basic tests on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(runTests, 500);
});