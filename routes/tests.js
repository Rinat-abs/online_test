const {Router} = require('express');
const router = Router();
const Test = require('../models/test');
const path = require('path');
const auth = require('../middleware/auth');
const mysql = require('mysql2/promise');
const config = require('../config');
const uuid = require('uuid').v4;
const fs = require('fs');

const testing = new Test();

router.get('/', auth, async(req, res) => {
    const tests = await testing.getUserTests(req.user.id);

    // console.log(tests)
    res.render('tests', {
        isTests: true,
        title: 'Тестовая страница',
        tests,
        addJsDefault: true,
        error: req.flash('error') 
        
    })
});



router.post('/', auth, async(req, res) => {
    try{
    
        const connection = await mysql.createConnection(config);
        const tests = await testing.getUserTests(req.user.id);
        if( tests.length == 3)
        {
            fs.unlinkSync(path.join(__dirname, `../tests/${tests[0].file_name}`));
            await testing.removeTest(tests[0].id);
            
        }

        if(!req.file)
        {
           req.flash('error', 'Ошибка при загрузке файла');
           return res.redirect('/tests');
        }
     
        await connection.execute(`INSERT INTO tests SET id="${uuid()}", userId="${req.user.id}", name="${req.body.test_name}", file_name="${req.file.filename}", count="${req.body.count}", cycle="${0}"`);
        await connection.end();
        res.redirect('/tests');
    }
    catch(e)
    {
        console.log(e);

    }
    
});




router.post('/remove', auth, async(req, res) => {
    
    const test = await testing.getTest(req.body.testId);

    if(test.userId == req.user.id)
    {   
        fs.unlinkSync(path.join(__dirname, `../tests/${test.file_name}`));
        await testing.removeTest(req.body.testId);
        
        
    }
    res.redirect('/tests');
});


router.get('/:id',  auth, async (req, res) => {
    const test = await testing.getTest(req.params.id);
    if(!test) return res.redirect('/'); 
    const testPath =  path.join(__dirname,`../tests/${test.file_name}`);
    const file =  testing.checkFile(testPath);
    const testArr = testing.getTestArr(file, test.count + 1);
    const cycle = testing.getRemains(testArr.length, 40);
   
    if(test)
    {
        if(test.userId == req.user.id)
        {
            res.render('test', {
                title: `Тест \"${test.name}\"`,
                test,
                addStyle: '../css/style.min.css',
                addMenu: '../js/menu.js',
                testArr,
                cycleSize: cycle.length,
                currentCycle:  test.cycle
            })
        } 
        else 
        {
            res.redirect('/tests');
        }
    }
    else {
        res.redirect('/tests')
    }
    
    
});

router.post('/:id/reset', auth, async(req, res) => {
    const test = await testing.getTest(req.params.id);
    if( !req.body) return res.redirect('/');
    if(!req.body.reset) return res.redirect('/');
    if(test)
    {
        if(test.userId == req.user.id)
        {
            if(test.id == req.body.reset)
            {
                await testing.resetCycle(test.id);
                res.redirect(`/tests/${test.id}`);
            }
            else 
            {
                res.redirect(`/tests/${test.id}`);
            }
        }
        else 
        {
            res.redirect('/tests');
        }
    }
    else
    {
        res.redirect('/tests');
    }
});




router.get('/:id/random', auth, async(req, res) => {
    const test = await testing.getTest(req.params.id); 
    if(test.userId == req.user.id)
    {   
        const testPath =  path.join(__dirname,`../tests/${test.file_name}`);
        const file =  testing.checkFile(testPath);
        const testArr = testing.getTestArr(file, test.count + 1);
        const randomArr = testing.getRandomArr(testArr);
        res.render('random', {
            title: 'Вопросы - ' + test.name,
            test,
            testArr,
            randomArr,
            getRandomNum: function(max)
            {
                return Math.floor(Math.random() * Math.floor(max));
            },
            addStyle: '../../css/style.min.css',
            addMenu: '../../js/menu.js',
            addJs: '../../js/app.js'
            
        })
    } 
    else 
    {
        res.redirect('/tests');
        
    }

});

router.get('/:id/cycle', auth, async(req, res) => {
    const test = await testing.getTest(req.params.id); 

    if(test.userId == req.user.id)
    {   
        const testPath =  path.join(__dirname,`../tests/${test.file_name}`);
        const file =  testing.checkFile(testPath);
        const testArr = testing.getTestArr(file, test.count + 1);
       
        const cycleArr = testing.getCycleArr(test.cycle, testArr);
       
        res.render('cycle', {

            title: 'Вопросы - ' + test.name,
            addStyle: '../../css/style.min.css',
            test,
            testArr,
            cycleArr,
            getRandomNum: function(max)
            {
                return Math.floor(Math.random() * Math.floor(max));
            },
            addMenu: '../../js/menu.js',
            addJs: '../../js/app.js'
            

            

        });
        
    }
    else 
    {
        res.redirect('/tests');
    }

});



router.get('/:id/search', auth, async(req, res) => {
    const test = await testing.getTest(req.params.id); 
    if(test.userId == req.user.id)
    {
        const testPath =  path.join(__dirname,`../tests/${test.file_name}`);
        const file =  testing.checkFile(testPath);
        const testArr = testing.getTestArr(file, test.count + 1);

       
        res.render('search', {
            title: `Поиск " ${test.name} "`,
            addStyle: '../../css/style.min.css',
            test: testArr,
            addMenu: '../../js/menu.js',
            

        })
    }
    else 
    {
        return res.redirect('/tests')
    }
    
});




router.post('/result', async(req, res) => {
    if( !req.body) return res.redirect('/');
    if(!req.body.testId) return res.redirect('/');
    const cycle = req.body.cycle;
    const test = await testing.getTest(req.body.testId);
    delete req.body.testId;
    delete req.body._csrf;
    
    
    const testPath =  path.join(__dirname,`../tests/${test.file_name}`);
    const file =  testing.checkFile(testPath);
    const testArr = testing.getTestArr(file, test.count + 1);
    const data = testing.checkTest(req.body, testArr);
    let rightCount = 0;
    if((typeof data) != 'string')
    {
        for( let i = 0; i < data.length; i++)
        {
            if(data[i].check)

            {
                rightCount++;
            }
        }
        await testing.addProgress(req.user.id, test, `${rightCount} / ${data.length}`);
        if(cycle)
        {
            await testing.updateCycle(test.id, test.cycle, testArr);
        }

    }
    res.render('result', {
        title: 'Результат теста - ' + test.name,
        addStyle: '../../css/style.min.css',
        addMenu: '../../js/menu.js',
        data, 
        test,
        rightCount,
        addJs: true

    });

});



module.exports = router;