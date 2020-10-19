
/*
 * Widget 相关设置
 * =====================================================
 */
// 重置小部件
const resetWidget = false
// 小组件大小
const widgetSize = "medium"
//是否显示图片背景
const imageBackground = true
// 设置默认的边距（更多边距设置参考setpadding）
const padding = 5

/*
 * 定位相关设置 
 * =====================================================
 */
// 区域设置
let locale = "zh_cn"
// 是否固定定位
const lockLocation = false

/*
 * 天气接口
 * =====================================================
 */
const apiKey = ""


/*
 * 布局
 * 此设置决定要在小部件上显示的项目。
 */

const items = [
    row,

    column,
    greeting,
    date,
    battery,

    column(90),
    right,
    current,
    future,

    row,

    column,
    left,
    events,

    column(90),
    right,
    sunrise,

]

/*
 * 组件相关设置
 * =====================================================
 */

// 日期组件
// ==============
const dateSettings = {

    // 如果设置为true，则显示事件时日期将变小
    dynamicDateSize: false,

    // 日期为非动态显示时候的大小   [large|small]
    staticDateSize: "large",

    // 设置每种日期类型的日期格式。参见 https://docs.scriptable.app/dateformatter
    smallDateFormat: "yyyy年MM月d日,E", // 设置为 small 时此项生效
    largeDateLineOne: "yyyy年MM月d日", // 设置为 large 时此项生效并显示在第一行
    largeDateLineTwo: "EEEE",  // 设置为 large 时生效并显示在第二行
}

// 代办事件
// ==============
const eventSettings = {
    // 最多显示的代办事项数量
    numberOfEvents: 3,

    // 是否显示全天的事件   [true|false]
    showAllDay: true,

    // 是否显示明天的事件   [true|false]
    showTomorrow: true,

    // 是否显示事件的持续时间 [""|"duration"|"time"]
    showEventLength: "duration",

    // 设置要显示事件的日历, [] 表示所有日历
    selectCalendars: [],

    // 显示日历的颜色和形状,"" 表示无颜色 
    showCalendarColor: "rectangle left",

    // 如果没有事件，显示一条固定消息或自定义内容   ["message"|"greeting"|"none"]
    noEventBehavior: "message",
}

// 日出日出
// ==============
const sunriseSettings = {
    // 日出或日落前后多少分钟才​​能显示此项。如果想始终显示则设置为 0
    showWithin: 0
}

// 天气
// ===========
const weatherSettings = {

    // 设置温度单位 ["metric"|"imperial"]
    units: "metric",

    // 是否显示当前天气的位置 (开启后会占用顶部位置空间)  [true|false]
    showLocation: false,

    // 是否显示天气对应的文字说明   [true|false]
    showCondition: false,

    // 是否显示今天的最高/低温度    [true|false]
    showHighLow: true,

    // 设置从几点开始显示明天天气 24为不显示明天天气
    tomorrowShownAtHour: 21,
}

/*
 * 文本设置
 * =====================================================
 */

// 您可以更改窗口小部件中任何文本
const localizedText = {

    // 如果在布局中添加问候语，则显示此处的文本。
    nightGreeting: "该睡觉了哟!",
    morningGreeting: "早上好呀!",
    noonGreeting: "中午好呀!",
    afternoonGreeting: "下午好呀!",
    eveningGreeting: "晚上好呀!",

    // 如果将未来的天气项目添加到布局或明天的事件中，则显示此处的文本。
    nextHourLabel: "接下来",
    tomorrowLabel: "明天",

    // 当没有事件时则显示此处的消息
    noEventMessage: "今天也是光芒万丈的一天!",

    // 事件持续时间显示的文本（小时/分钟）。
    durationMinute: "分",
    durationHour: "小时"

}

// 设置各种文本元素的字体 参考 http://iosfonts.com 查找要使用的字体
const textFormat = {
    // 设置默认的字体和颜色。
    defaultText: { size: 14, color: "#34495E", font: "medium" },

    // 以下的空白值都将使用上面的默认值。
    smallDate: { size: 16, color: "", font: "semibold" },
    largeDate1: { size: 16, color: "", font: "medium" },
    largeDate2: { size: 16, color: "", font: "medium" },

    greeting: { size: 24, color: "", font: "semibold" },
    eventLabel: { size: 14, color: "", font: "semibold" },
    eventTitle: { size: 14, color: "", font: "semibold" },
    eventTime: { size: 14, color: "", font: "medium" },
    noEvents: { size: 16, color: "", font: "semibold" },

    largeTemp: { size: 16, color: "", font: "semibold" },
    smallTemp: { size: 12, color: "", font: "medium" },
    tinyTemp: { size: 10, color: "", font: "medium" },

    customText: { size: 14, color: "", font: "medium" },

    battery: { size: 16, color: "", font: "medium" },
    sunrise: { size: 10, color: "", font: "medium" },
}

/*
 * 小部件代码
 * ===============================================
 */

// 语言环境值，对应上面设置的语言，不设置将使用设备的语言
if (locale == "" || locale == null) { locale = Device.locale() }

// 声明组件需要的数据
var eventData, locationData, sunData, weatherData

// 创建全局常量
const currentDate = new Date()
const files = FileManager.local()
var currentRow = {}
var currentColumn = {}

// 设置初始对齐方式
var currentAlignment = alignLeft

// 使用 padding 来设定 Widget
const widget = new ListWidget()
const horizontalPad = padding < 10 ? 10 - padding : 10
const verticalPad = padding < 15 ? 15 - padding : 15
widget.setPadding(horizontalPad, verticalPad, horizontalPad, verticalPad)
widget.spacing = 0

// 设置组件布局
for (item of items) { await item(currentColumn) }

/*
 * Widget 背景显示
 * =========================
 */
if (imageBackground) {
    const imageBackgroundPath = files.joinPath(files.documentsDirectory(), "imageBackgroundPath")
    const imageBackgroundExists = files.fileExists(imageBackgroundPath)

    if (imageBackgroundExists && (config.runsInWidget || !resetWidget)) {
        widget.backgroundImage = files.readImage(imageBackgroundPath)

    } else if (!imageBackgroundExists && config.runsInWidget) {
        widget.backgroundColor = Color.gray()

    } else {
        var message
        message = "开始之前，请先进入主屏幕长按任意图标进入编辑模式，并右划到空白页截图"
        let exitOptions = ["下一步", "退出去截图"]
        let shouldExit = await generateAlert(message, exitOptions)
        if (shouldExit) return


        let img = await Photos.fromLibrary()
        let height = img.size.height
        let phone = phoneSizes()[height]
        if (!phone) {
            message = "选择的图片不符合要求，请按照上一步操作进行"
            await generateAlert(message, ["确定"])
            return
        }

        message = "你希望创建哪种大小的 Widget?"
        let sizes = ["Small", "Medium", "Large"]
        let size = await generateAlert(message, sizes)
        let widgetSize = sizes[size]

        message = "你想把Widget放到主屏幕的哪个位置?"
        message += (height == 1136 ? " (注意，你的手机屏幕限制只支持两行 widgets, 所以 middle 和 bottom 选项效果一致)" : "")

        let crop = { w: "", h: "", x: "", y: "" }
        if (widgetSize == "Small") {
            crop.w = phone.small
            crop.h = phone.small
            let positions = ["Top left", "Top right", "Middle left", "Middle right", "Bottom left", "Bottom right"]
            let position = await generateAlert(message, positions)

            let keys = positions[position].toLowerCase().split(' ')
            crop.y = phone[keys[0]]
            crop.x = phone[keys[1]]

        } else if (widgetSize == "Medium") {
            crop.w = phone.medium
            crop.h = phone.small

            crop.x = phone.left
            let positions = ["Top", "Middle", "Bottom"]
            let position = await generateAlert(message, positions)
            let key = positions[position].toLowerCase()
            crop.y = phone[key]

        } else if (widgetSize == "Large") {
            crop.w = phone.medium
            crop.h = phone.large
            crop.x = phone.left
            let positions = ["Top", "Bottom"]
            let position = await generateAlert(message, positions)

            crop.y = position ? phone.middle : phone.top
        }
        let imgCrop = cropImage(img, new Rect(crop.x, crop.y, crop.w, crop.h))
        files.writeImage(imageBackgroundPath, imgCrop)

    }

} else {
    let gradient = new LinearGradient()
    let gradientSettings = await setupGradient()

    gradient.colors = gradientSettings.color()
    gradient.locations = gradientSettings.position()

    widget.backgroundGradient = gradient
}

// 完成小部件并显示预览
Script.setWidget(widget)
if (widgetSize == "small") { widget.presentSmall() }
else if (widgetSize == "medium") { widget.presentMedium() }
else if (widgetSize == "large") { widget.presentLarge() }
Script.complete()

/*
 * 布局管理
 * =============================================
 */

// 在 Widget 上创建新行
function row(input = null) {

    function makeRow() {
        currentRow = widget.addStack()
        currentRow.layoutHorizontally()
        currentRow.setPadding(0, 0, 0, 0)
        currentColumn.spacing = 0

        // 如果输入了参数则使用参数的尺寸大小来创建
        if (input > 0) { currentRow.size = new Size(0, input) }
    }

    if (!input || typeof input == "number") { return makeRow }

    else { makeRow() }
}

// 在 Widget 上创建新列
function column(input = null) {

    function makeColumn() {
        currentColumn = currentRow.addStack()
        currentColumn.layoutVertically()
        currentColumn.setPadding(0, 0, 0, 0)
        currentColumn.spacing = 0

        if (input > 0) { currentColumn.size = new Size(input, 0) }
    }

    if (!input || typeof input == "number") { return makeColumn }

    else { makeColumn() }
}

// 创建对齐的 Stack 以向其添加内容
function align(column) {
    // 将包含Stack的内容添加到该列中
    let alignmentStack = column.addStack()
    alignmentStack.layoutHorizontally()

    // 获取正确的Stack
    let returnStack = currentAlignment(alignmentStack)
    returnStack.layoutVertically()
    return returnStack
}

// 创建一个右对齐的Stack
function alignRight(alignmentStack) {
    alignmentStack.addSpacer()
    let returnStack = alignmentStack.addStack()
    return returnStack
}

// 创建一个左对齐的Stack
function alignLeft(alignmentStack) {
    let returnStack = alignmentStack.addStack()
    alignmentStack.addSpacer()
    return returnStack
}

// 创建一个居中的Stack
function alignCenter(alignmentStack) {
    alignmentStack.addSpacer()
    let returnStack = alignmentStack.addStack()
    alignmentStack.addSpacer()
    return returnStack
}

// 创建制定长度(最短1)的空格
function space(input = null) {

    // 此函数在输入宽度处添加一个间距
    function spacer(column) {

        if (!input || input == 0) { column.addSpacer() }

        else { column.addSpacer(input) }
    }

    // 如果没有输入或是数字，则在列声明中调用它
    if (!input || typeof input == "number") { return spacer }

    // 否则，将在列生成器中调用它
    else { input.addSpacer() }
}

// 将当前对齐方式更改右对齐
function right(x) { currentAlignment = alignRight }

// 将当前对齐方式更改为左对齐
function left(x) { currentAlignment = alignLeft }

// 将当前对齐方式更改为居中
function center(x) { currentAlignment = alignCenter }

/*
 * 组件代码
 * ==============================================
 */

// 设定事件日期的对象
async function setupEvents() {

    eventData = {}
    const calendars = eventSettings.selectCalendars
    const numberOfEvents = eventSettings.numberOfEvents

    // 判断是否应该显示事件。
    function shouldShowEvent(event) {

        // 如果事件被过滤，并且日历不在所选日历中，则返回false
        if (calendars.length && !calendars.includes(event.calendar.title)) { return false }

        // 删除已取消的事件
        if (event.title.startsWith("Canceled:")) { return false }

        // 如果是全天事件，则仅在设置处于active状态时显示
        if (event.isAllDay) { return eventSettings.showAllDay }

        // 否则，会返回处于未来的事件
        return (event.startDate.getTime() > currentDate.getTime())
    }

    // 判断要显示的事件以及数量
    const todayEvents = await CalendarEvent.today([])
    let shownEvents = 0
    let futureEvents = []

    for (const event of todayEvents) {
        if (shownEvents == numberOfEvents) { break }
        if (shouldShowEvent(event)) {
            futureEvents.push(event)
            shownEvents++
        }
    }

    // 如果需要的话，显示明天的事件
    let multipleTomorrowEvents = false
    if (eventSettings.showTomorrow && shownEvents < numberOfEvents) {

        const tomorrowEvents = await CalendarEvent.tomorrow([])
        for (const event of tomorrowEvents) {
            if (shownEvents == numberOfEvents) { break }
            if (shouldShowEvent(event)) {

                // 在第一个明天事件之前添加"明天"标签
                if (!multipleTomorrowEvents) {

                    futureEvents.push({ title: localizedText.tomorrowLabel.toUpperCase(), isLabel: true })
                    multipleTomorrowEvents = true
                }
                // 显示明天的事件并增加计数器
                futureEvents.push(event)
                shownEvents++
            }
        }
    }
    // 存储未来的事件，以及是否显示全部事件
    eventData.futureEvents = futureEvents
    eventData.eventsAreVisible = (futureEvents.length > 0) && (eventSettings.numberOfEvents > 0)
}

// 设置小部件渐变背景
async function setupGradient() {
    if (!sunData) { await setupSunrise() }
    let gradient = {
        dawn: {
            color() { return [new Color("#142C52"), new Color("#1B416F"), new Color("#62668B")] },
            position() { return [0, 0.5, 1] },
        },
        sunrise: {
            color() { return [new Color("#274875"), new Color("#766f8d"), new Color("#f0b35e")] },
            position() { return [0, 0.8, 1.5] },
        },
        midday: {
            color() { return [new Color("#3a8cc1"), new Color("#90c0df")] },
            position() { return [0, 1] },
        },
        noon: {
            color() { return [new Color("#b2d0e1"), new Color("#80B5DB"), new Color("#3a8cc1")] },
            position() { return [-0.2, 0.2, 1.5] },
        },
        sunset: {
            color() { return [new Color("#32327A"), new Color("#662E55"), new Color("#7C2F43")] },
            position() { return [0.1, 0.9, 1.2] },
        },
        twilight: {
            color() { return [new Color("#021033"), new Color("#16296b"), new Color("#414791")] },
            position() { return [0, 0.5, 1] },
        },
        night: {
            color() { return [new Color("#16296b"), new Color("#021033"), new Color("#021033"), new Color("#113245")] },
            position() { return [-0.5, 0.2, 0.5, 1] },
        },
    }
    const sunrise = sunData.sunrise
    const sunset = sunData.sunset

    if (closeTo(sunrise) <= 15) { return gradient.sunrise }
    if (closeTo(sunset) <= 15) { return gradient.sunset }
    if (closeTo(sunrise) <= 30 && utcTime < sunrise) { return gradient.dawn }
    if (closeTo(sunset) <= 30 && utcTime > sunset) { return gradient.twilight }
    if (isNight(currentDate)) { return gradient.night }
    if (currentDate.getHours() == 12) { return gradient.noon }

    return gradient.midday
}

// 设置位置数据对象
async function setupLocation() {
    locationData = {}
    const locationPath = files.joinPath(files.documentsDirectory(), "locationPath")

    // 如果位置非固定或没有缓存或重置脚本
    var readLocationFromFile = false
    if (!lockLocation || !files.fileExists(locationPath) || resetWidget) {
        try {
            const location = await Location.current()
            const geocode = await Location.reverseGeocode(location.latitude, location.longitude, locale)
            locationData.latitude = location.latitude
            locationData.longitude = location.longitude
            locationData.locality = geocode[0].locality
            files.writeString(locationPath, location.latitude + "|" + location.longitude + "|" + locationData.locality)

        } catch (e) {
            if (!lockLocation) { readLocationFromFile = true }
            else { return }
        }
    }
    // 如果位置信息被锁定或需要从文件中读取，执行此操作
    if (lockLocation || readLocationFromFile) {
        const locationStr = files.readString(locationPath).split("|")
        locationData.latitude = locationStr[0]
        locationData.longitude = locationStr[1]
        locationData.locality = locationStr[2]
    }
}

// 设置日落/日出数据对象
async function setupSunrise() {

    if (!locationData) { await setupLocation() }
    // 设置日出/日落缓存
    const todaySunCachePath = files.joinPath(files.documentsDirectory(), "todaySunCachePath")
    const tomorrowSunCachePath = files.joinPath(files.documentsDirectory(), "tomorrowSunCachePath")

    const todaySunCacheExists = files.fileExists(todaySunCachePath)
    const tomorrowCacheExists = files.fileExists(tomorrowSunCachePath)

    const todaySunCacheDate = todaySunCacheExists ? files.modificationDate(todaySunCachePath) : 0
    const tomorrowSunCacheDate = tomorrowCacheExists ? files.modificationDate(tomorrowSunCachePath) : 0

    let todaySunDataRaw, tomorrowSunDataRaw

    // 如果缓存存在并且是今天创建的，使用缓存的数据
    if (todaySunCacheExists && tomorrowCacheExists && sameDay(currentDate, todaySunCacheDate) && sameDay(currentDate, tomorrowSunCacheDate)) {
        const todaySunCache = files.readString(todaySunCachePath)
        const tomorrowSunCache = files.readString(tomorrowSunCachePath)
        todaySunDataRaw = JSON.parse(todaySunCache)
        tomorrowSunDataRaw = JSON.parse(tomorrowSunCache)
    }

    // 如果还没有数据，或者需要获取明天的数据 或者重置脚本
    if (!todaySunDataRaw || !tomorrowSunDataRaw || resetWidget) {
        today = new Date()
        tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const todaySunReq = "https://api.heweather.net/v7/astronomy/sunmoon?location=" + locationData.longitude + "," + locationData.latitude + "&key=" + apiKey + "&lang=zh&date=" + today.getFullYear() + (today.getMonth() + 1) + today.getDate()
        todaySunDataRaw = await new Request(todaySunReq).loadJSON()
        const tomorrowSunReq = "https://api.heweather.net/v7/astronomy/sunmoon?location=" + locationData.longitude + "," + locationData.latitude + "&key=" + apiKey + "&lang=zh&date=" + tomorrow.getFullYear() + (tomorrow.getMonth() + 1) + tomorrow.getDate() + 1
        tomorrowSunDataRaw = await new Request(tomorrowSunReq).loadJSON()
        files.writeString(todaySunCachePath, JSON.stringify(todaySunDataRaw))
        files.writeString(tomorrowSunCachePath, JSON.stringify(tomorrowSunDataRaw))
    }

    sunData = {}
    sunData.sunrise = new Date(todaySunDataRaw.sunrise).getTime()
    sunData.sunset = new Date(todaySunDataRaw.sunset).getTime()
    sunData.tomorrowSunrise = new Date(tomorrowSunDataRaw.sunrise).getTime()
}

// 设置天气数据对象
async function setupWeather() {

    if (!locationData) { await setupLocation() }

    // 设定缓存
    const weatherCurrentCachePath = files.joinPath(files.documentsDirectory(), "weatherCurrentCachePath")
    const weatherDailyCachePath = files.joinPath(files.documentsDirectory(), "weatherDailyCachePath")
    const weather24hCachePath = files.joinPath(files.documentsDirectory(), "weather24hCachePath")

    const weatherCurrentCacheExists = files.fileExists(weatherCurrentCachePath)
    const weatherDailyCacheExists = files.fileExists(weatherDailyCachePath)
    const weather24hCacheExists = files.fileExists(weather24hCachePath)


    const weatherCurrentCacheDate = weatherCurrentCacheExists ? files.modificationDate(weatherCurrentCachePath) : 0

    var weatherCurrentRaw
    var weatherDailyRaw
    var weather24hRaw

    // 如果存在缓存，并且距离上次请求少于60秒，使用缓存的数据
    if (weatherCurrentCacheExists && weatherDailyCacheExists && weather24hCacheExists && (currentDate.getTime() - weatherCurrentCacheDate.getTime()) < 60000 && !resetWidget) {
        const currentCache = files.readString(weatherCurrentCachePath)
        const dailyCache = files.readString(weatherDailyCachePath)
        const hourCache = files.readString(weather24hCachePath)

        weatherCurrentRaw = JSON.parse(currentCache)
        weatherDailyRaw = JSON.parse(dailyCache)
        weather24hRaw = JSON.parse(hourCache)
        // 使用API​​获取新的天气数据
    } else {
        const weatherCurrentReq = "https://api.heweather.net/v7/weather/now?location=" + locationData.longitude + "," + locationData.latitude + "&lang=zh&key=" + apiKey
        weatherCurrentRaw = await new Request(weatherCurrentReq).loadJSON()
        files.writeString(weatherCurrentCachePath, JSON.stringify(weatherCurrentRaw))

        const weatherDailyReq = "https://api.heweather.net/v7/weather/3d?location=" + locationData.longitude + "," + locationData.latitude + "&lang=zh&key=" + apiKey
        weatherDailyRaw = await new Request(weatherDailyReq).loadJSON()
        files.writeString(weatherDailyCachePath, JSON.stringify(weatherDailyRaw))

        const weather24hReq = "https://api.heweather.net/v7/weather/24h?location=" + locationData.longitude + "," + locationData.latitude + "&lang=zh&key=" + apiKey
        weather24hRaw = await new Request(weather24hReq).loadJSON()
        files.writeString(weather24hCachePath, JSON.stringify(weather24hRaw))

    }

    // 储存天气数据值
    weatherData = {}
    weatherData.currentTemp = weatherCurrentRaw.now.temp
    weatherData.currentCondition = weatherCurrentRaw.now.icon
    weatherData.currentDescription = weatherCurrentRaw.now.text

    weatherData.todayHigh = weatherDailyRaw.daily[0].tempMax
    weatherData.todayLow = weatherDailyRaw.daily[0].tempMin

    weatherData.nextHourTemp = weather24hRaw.hourly[0].temp
    weatherData.nextHourCondition = weather24hRaw.hourly[0].icon

    weatherData.tomorrowHigh = weatherDailyRaw.daily[1].tempMax
    weatherData.tomorrowLow = weatherDailyRaw.daily[1].tempMin
    weatherData.tomorrowCondition = weatherDailyRaw.daily[1].iconDay
}

/*
 * 小部件项目
 * ============================================
 */
// 在小部件上显示日期
async function date(column) {
    if (!eventData && dateSettings.dynamicDateSize) { await setupEvents() }
    // 设置日期格式并设置其语言环境
    let df = new DateFormatter()
    df.locale = locale

    // 如果是有文本或有事件显示，则显示为小日期样式
    if (dateSettings.staticDateSize == "small" || (dateSettings.dynamicDateSize && eventData.eventsAreVisible)) {
        let dateStack = align(column)
        dateStack.setPadding(padding, padding, padding, padding)

        df.dateFormat = dateSettings.smallDateFormat
        let dateText = provideText(df.string(currentDate), dateStack, textFormat.smallDate)

    } else {
        let dateOneStack = align(column)
        df.dateFormat = dateSettings.largeDateLineOne
        let dateOne = provideText(df.string(currentDate), dateOneStack, textFormat.largeDate1)
        dateOneStack.setPadding(padding / 2, padding, 0, padding)

        let dateTwoStack = align(column)
        df.dateFormat = dateSettings.largeDateLineTwo
        let dateTwo = provideText(df.string(currentDate), dateTwoStack, textFormat.largeDate2)
        dateTwoStack.setPadding(0, padding, padding, padding * 2) //日期的间距设置，当你在日期设置中选择了显示“large”日期时，调整这项以更改边距，依次是逆时针顺序上、左、下、右
    }
}

// 在小部件上显示每个时间段的问候语
async function greeting(column) {
    // 此函数可以调整一天中不同时间段的问候语显示
    function makeGreeting() {
        const hour = currentDate.getHours()
        if (hour < 5) { return localizedText.nightGreeting }
        if (hour < 11) { return localizedText.morningGreeting }
        if (hour > 11 && hour - 12 < 1) { return localizedText.noonGreeting }
        if (hour - 12 < 6) { return localizedText.afternoonGreeting }
        if (hour - 12 < 10) { return localizedText.eveningGreeting }
        return localizedText.nightGreeting
    }

    // 设置问候语Stack和边距
    let greetingStack = align(column)
    let greeting = provideText(makeGreeting(), greetingStack, textFormat.greeting)
    greetingStack.setPadding(padding, padding, padding, padding) //问候语的间距设置，调整这项以更改边距，依次是逆时针顺序上、左、下、右
}

// 在小部件上显示事件
async function events(column) {
    if (!eventData) { await setupEvents() }
    // 判断没有事件时该显示什么
    if (!eventData.eventsAreVisible) {
        const display = eventSettings.noEventBehavior
        // 如果是问候语，将由问候语函数处理它
        if (display == "greeting") { return await greeting(column) }

        // 如果是消息，将获取本地化的文本
        if (display == "message" && localizedText.noEventMessage.length) {
            const messageStack = align(column)
            messageStack.setPadding(padding, padding, padding, padding) //自定义本文的间距设置，如果你选择了没有事件是显示这个内容，调整这项以更改边距，依次是逆时针顺序上、左、下、右
            provideText(localizedText.noEventMessage, messageStack, textFormat.noEvents)
        }

        return
    }

    // 设置事件Stack和间距
    let eventStack = column.addStack()
    eventStack.layoutVertically()
    const todaySeconds = Math.floor(currentDate.getTime() / 1000) - 978307200
    eventStack.url = 'calshow:' + todaySeconds

    if (!eventData.eventsAreVisible && localizedText.noEventMessage.length) {
        let message = provideText(localizedText.noEventMessage, eventStack, textFormat.noEvents)
        eventStack.setPadding(padding, padding, padding, padding) //事件的间距设置，调整这项以更改边距，依次是逆时针顺序上、左、下、右
        return
    }

    // 如果没有事件显示将不会显示这个事件Stack
    eventStack.setPadding(0, 0, 0, 0) //当没有事件时改为这个边距，全是0代表不限制这个Stack了，被自定义文本替代（这个默尔开启了，可开启/关闭）

    // 将每个事件添加到Stack中
    var currentStack = eventStack
    const futureEvents = eventData.futureEvents
    for (let i = 0; i < futureEvents.length; i++) {

        const event = futureEvents[i]
        const bottomPadding = (padding - 10 < 0) ? 0 : padding - 10

        // 如果是明天的lable，则改用明天的Stack
        if (event.isLabel) {
            let tomorrowStack = column.addStack()
            tomorrowStack.layoutVertically()
            const tomorrowSeconds = Math.floor(currentDate.getTime() / 1000) - 978220800
            tomorrowStack.url = 'calshow:' + tomorrowSeconds
            currentStack = tomorrowStack

            // 事件标题的格式
            const eventLabelStack = align(currentStack)
            const eventLabel = provideText(event.title, eventLabelStack, textFormat.eventLabel)
            eventLabelStack.setPadding(padding, padding, padding, padding)
            continue
        }

        const titleStack = align(currentStack)
        titleStack.layoutHorizontally()
        const showCalendarColor = eventSettings.showCalendarColor
        const colorShape = showCalendarColor.includes("circle") ? "circle" : "rectangle"

        if (showCalendarColor.length && !showCalendarColor.includes("right")) {
            let colorItemText = provideTextSymbol(colorShape) + " "
            let colorItem = provideText(colorItemText, titleStack, textFormat.eventTitle)
            colorItem.textColor = event.calendar.color
        }

        const title = provideText(event.title.trim(), titleStack, textFormat.eventTitle)
        titleStack.setPadding(padding, padding, event.isAllDay ? padding : padding / 5, padding)

        if (showCalendarColor.length && showCalendarColor.includes("right")) {
            let colorItemText = " " + provideTextSymbol(colorShape)
            let colorItem = provideText(colorItemText, titleStack, textFormat.eventTitle)
            colorItem.textColor = event.calendar.color
        }

        // //如果事件太多，限制行高
        if (futureEvents.length >= 3) { title.lineLimit = 1 }

        // 如果是全天的的事件，则不显示时间
        if (event.isAllDay) { continue }

        // 格式化时间信息
        let timeText = formatTime(event.startDate)

        // 如果显示为时间，添加一个破折号“-”
        if (eventSettings.showEventLength == "time") {
            timeText += "–" + formatTime(event.endDate)

        } else if (eventSettings.showEventLength == "duration") {
            const duration = (event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60)
            const hours = Math.floor(duration / 60)
            const minutes = Math.floor(duration % 60)
            const hourText = hours > 0 ? hours + localizedText.durationHour : ""
            const minuteText = minutes > 0 ? minutes + localizedText.durationMinute : ""
            const showSpace = hourText.length && minuteText.length
            timeText += " \u2022 " + hourText + (showSpace ? " " : "") + minuteText
        }

        const timeStack = align(currentStack)
        const time = provideText(timeText, timeStack, textFormat.eventTime)
        timeStack.setPadding(0, padding, padding, padding)
    }
}

// 显示当前天气在小部件上
async function current(column) {

    if (!weatherData) { await setupWeather() }
    if (!sunData) { await setupSunrise() }

    // 设置当前天气的Stack
    let currentWeatherStack = column.addStack()
    currentWeatherStack.layoutVertically()
    currentWeatherStack.setPadding(0, 0, 0, 0) //当前天气的间距设置，调整这项以更改边距，依次是逆时针顺序上、左、下、右

    // 显示位置
    if (weatherSettings.showLocation) {
        let locationTextStack = align(currentWeatherStack)
        let locationText = provideText(locationData.locality, locationTextStack, textFormat.smallTemp)
        locationTextStack.setPadding(padding, padding, padding, padding) //位置名称的间距设置，调整这项以更改边距，依次是逆时针顺序上、左、下、右（这个默认关闭，可到天气设置处启用）
    }

    // 显示当前天气的图标
    let mainConditionStack = align(currentWeatherStack)
    let mainCondition = mainConditionStack.addImage(provideConditionSymbol(weatherData.currentCondition))
    mainCondition.imageSize = new Size(22, 22)
    mainConditionStack.setPadding(weatherSettings.showLocation ? 0 : padding, padding, 0, padding) //当前天气图标的间距设置，调整这项以更改边距，依次是逆时针顺序上、左、下、右

    // 如果要显示天气描述
    if (weatherSettings.showCondition) {
        let conditionTextStack = align(currentWeatherStack)
        let conditionText = provideText(weatherData.currentDescription, conditionTextStack, textFormat.smallTemp)
        conditionTextStack.setPadding(padding, padding, 0, padding) //天气描述的间距设置，调整这项以更改边距，依次是逆时针顺序上、左、下、右
    }

    // 显示当前温度
    const tempStack = align(currentWeatherStack)
    tempStack.setPadding(0, padding, 0, padding) //当前温度的间距设置，调整这项以更改边距，依次是逆时针顺序上、左、下、右
    const tempText = Math.round(weatherData.currentTemp) + "°"
    const temp = provideText(tempText, tempStack, textFormat.largeTemp)

    // 如果不显示温度条和高/低值 在此结束
    if (!weatherSettings.showHighLow) { return }

    // 显示温度条和高/低值
    let tempBarStack = align(currentWeatherStack)
    tempBarStack.layoutVertically()
    tempBarStack.setPadding(0, padding, padding, padding) //高/低温度的间距设置，调整这项以更改边距，依次是逆时针顺序上、左、下、右

    let tempBar = drawTempBar()
    let tempBarImage = tempBarStack.addImage(tempBar)
    tempBarImage.size = new Size(50, 0)

    tempBarStack.addSpacer(1)

    let highLowStack = tempBarStack.addStack()
    highLowStack.layoutHorizontally()

    const mainLowText = Math.round(weatherData.todayLow).toString()
    const mainLow = provideText(mainLowText, highLowStack, textFormat.tinyTemp)
    highLowStack.addSpacer()
    const mainHighText = Math.round(weatherData.todayHigh).toString()
    const mainHigh = provideText(mainHighText, highLowStack, textFormat.tinyTemp)

    tempBarStack.size = new Size(60, 30)
}

//显示未来的天气
async function future(column) {

    if (!weatherData) { await setupWeather() }
    if (!sunData) { await setupSunrise() }

    // 设置未来天气的Stack
    let futureWeatherStack = column.addStack()
    futureWeatherStack.layoutVertically()
    futureWeatherStack.setPadding(0, 0, 0, 0)

    // 判断是否应该显示下一个小时的天气
    const showNextHour = (currentDate.getHours() < weatherSettings.tomorrowShownAtHour)

    // 设置标签值
    const subLabelStack = align(futureWeatherStack)
    const subLabelText = showNextHour ? localizedText.nextHourLabel : localizedText.tomorrowLabel
    const subLabel = provideText(subLabelText, subLabelStack, textFormat.smallTemp)
    subLabelStack.setPadding(0, padding, padding / 2, padding)

    // 设置子条件的Stack
    let subConditionStack = align(futureWeatherStack)
    subConditionStack.layoutHorizontally()
    subConditionStack.centerAlignContent()
    subConditionStack.setPadding(0, padding, padding, padding)

    let subCondition = subConditionStack.addImage(provideConditionSymbol(showNextHour ? weatherData.nextHourCondition : weatherData.tomorrowCondition))
    const subConditionSize = showNextHour ? 14 : 18
    subCondition.imageSize = new Size(subConditionSize, subConditionSize)
    subConditionStack.addSpacer(5)

    // 与明天相比，下一个小时的显示内容会有很大变化
    if (showNextHour) {
        const subTempText = Math.round(weatherData.nextHourTemp) + "°"
        const subTemp = provideText(subTempText, subConditionStack, textFormat.smallTemp)

    } else {
        let tomorrowLine = subConditionStack.addImage(drawVerticalLine(new Color("#34495E", 0.5), 20))
        tomorrowLine.imageSize = new Size(3, 28)
        subConditionStack.addSpacer(5)
        let tomorrowStack = subConditionStack.addStack()
        tomorrowStack.layoutVertically()

        const tomorrowHighText = Math.round(weatherData.tomorrowHigh) + ""
        const tomorrowHigh = provideText(tomorrowHighText, tomorrowStack, textFormat.tinyTemp)
        tomorrowStack.addSpacer(4)
        const tomorrowLowText = Math.round(weatherData.tomorrowLow) + ""
        const tomorrowLow = provideText(tomorrowLowText, tomorrowStack, textFormat.tinyTemp)
    }
}

// 返回一个文本创建函数
function text(input = null) {

    function displayText(column) {

        // 如果输入为空，则不执行任何操作
        if (!input || input == "") { return }

        // 否则添加该文本
        const textStack = align(column)
        textStack.setPadding(padding, padding, padding, padding) //自定义文本的间距设置，调整这项以更改边距，依次是逆时针顺序上、左、下、右
        const textDisplay = provideText(input, textStack, textFormat.customText)
    }
    return displayText
}

// 向小部件添加电池元素；由电池图标和百分比组成
async function battery(column) {

    // 通过脚本函数获取电池电量并以简单的方式对其进行格式化
    function getBatteryLevel() {

        const batteryLevel = Device.batteryLevel()
        const batteryPercentage = `${Math.round(batteryLevel * 100)}%`

        return batteryPercentage
    }

    const batteryLevel = Device.batteryLevel()

    // 设置电池电量项目
    let batteryStack = align(column)
    batteryStack.layoutHorizontally()
    batteryStack.centerAlignContent()

    let batteryIcon = batteryStack.addImage(provideBatteryIcon())
    batteryIcon.imageSize = new Size(30, 30)

    // 如果电池电量小于等于20，则将电池图标更改为红色，以匹配系统行为
    if (Math.round(batteryLevel * 100) > 20 || Device.isCharging()) {

        batteryIcon.tintColor = new Color(textFormat.battery.color || textFormat.defaultText.color)

    } else {

        batteryIcon.tintColor = Color.red()

    }

    batteryStack.addSpacer(padding * 0.6)

    // 显示电池状态
    let batteryInfo = provideText(getBatteryLevel(), batteryStack, textFormat.battery)

    batteryStack.setPadding(padding / 2, padding, padding / 2, padding) //电池电量的间距设置，调整这项以更改边距，依次是逆时针顺序上、左、下、右

}

// 显示日出或日落时间
async function sunrise(column) {

    if (!sunData) { await setupSunrise() }

    const sunrise = sunData.sunrise
    const sunset = sunData.sunset
    const tomorrowSunrise = sunData.tomorrowSunrise
    const now = currentDate.getTime()

    const showWithin = sunriseSettings.showWithin
    const closeToSunrise = closeTo(sunrise) <= showWithin
    const closeToSunset = closeTo(sunset) <= showWithin

    if (showWithin > 0 && !closeToSunrise && !closeToSunset) { return }

    let showSunrise, showToday
    let timeText

    if (now < sunrise) {
        showSunrise = true
        showToday = true
    } else if (now >= sunrise && now < sunset) {
        showSunrise = false
        showToday = true
    } else {
        showSunrise = true
        showToday = false
    }

    // 设置Stack
    const sunriseStack = align(column)
    sunriseStack.setPadding(padding / 2, padding, padding / 2, padding) //日落日出的间距设置，调整这项以更改边距，依次是逆时针顺序上、左、下、右
    sunriseStack.layoutHorizontally()
    sunriseStack.centerAlignContent()

    sunriseStack.addSpacer(padding * 0.3)

    // 添加正确的符号
    const symbolName = showSunrise ? "sunrise" : "sunset"
    const symbol = sunriseStack.addImage(SFSymbol.named(symbolName).image)
    symbol.imageSize = new Size(22, 22)

    sunriseStack.addSpacer(padding)

    // 添加时间
    if (showSunrise) {
        if (showToday) {
            timeText = formatTime(new Date(sunrise))
        } else {
            timeText = formatTime(new Date(tomorrowSunrise))
        }
    } else {
        timeText = formatTime(new Date(sunset))
    }
    const time = provideText(timeText, sunriseStack, textFormat.sunrise)
}

// 允许使用任一术语
async function sunset(column) {
    return await sunrise(column)
}

async function generateAlert(message, options) {

    let alert = new Alert()
    alert.message = message

    for (const option of options) {
        alert.addAction(option)
    }

    let response = await alert.presentAlert()
    return response
}

/*
 * 辅助函数
 * ===================================================
 */
function isNight(dateInput) {
    const timeValue = dateInput.getTime()
    return (timeValue < sunData.sunrise) || (timeValue > sunData.sunset)
}

function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
}

function closeTo(time) {
    return -(currentDate.getTime() - time) / 60000
}

function formatTime(date) {
    let df = new DateFormatter()
    df.locale = locale
    df.useNoDateStyle()
    df.useShortTimeStyle()
    return df.string(date)
}

function provideTextSymbol(shape) {

    if (shape.startsWith("rect")) {
        return "\u2759"
    }
    if (shape == "circle") {
        return "\u2B24"
    }
    return "\u2759"
}

function provideBatteryIcon() {
    if (Device.isCharging()) { return SFSymbol.named("battery.100.bolt").image }

    const batteryWidth = 87
    const batteryHeight = 41

    let draw = new DrawContext()
    draw.opaque = false
    draw.respectScreenScale = true
    draw.size = new Size(batteryWidth, batteryHeight)

    draw.drawImageInRect(SFSymbol.named("battery.0").image, new Rect(0, 0, batteryWidth, batteryHeight))

    const x = batteryWidth * 0.1525
    const y = batteryHeight * 0.247
    const width = batteryWidth * 0.602
    const height = batteryHeight * 0.505

    let level = Device.batteryLevel()
    if (level < 0.05) { level = 0.05 }

    const current = width * level
    let radius = height / 6.5

    if (current < (radius * 2)) { radius = current / 2 }

    let barPath = new Path()
    barPath.addRoundedRect(new Rect(x, y, current, height), radius, radius)
    draw.addPath(barPath)
    draw.setFillColor(Color.black())
    draw.fillPath()
    return draw.getImage()
}

function provideConditionSymbol(cond) {

    let symbols = {
        "100": function () { return "sun.max" },
        "101": function () { return "cloud" },
        "102": function () { return "cloud" },
        "103": function () { return "cloud.sun" },
        "104": function () { return "cloud" },

        "150": function () { return "moon" },
        "153": function () { return "cloud.moon" },
        "154": function () { return "cloud.moon" },

        "300": function () { return "cloud.drizzle" },
        "301": function () { return "cloud.rain" },
        "302": function () { return "cloud.moon.bolt" },
        "303": function () { return "cloud.bolt.rain" },
        "304": function () { return "cloud.bolt.rain" },
        "305": function () { return "cloud.drizzle" },
        "306": function () { return "cloud.rain" },
        "307": function () { return "cloud.heavyrain" },
        "308": function () { return "cloud.heavyrain" },
        "309": function () { return "cloud.drizzle" },
        "310": function () { return "cloud.heavyrain" },
        "311": function () { return "cloud.heavyrain" },
        "312": function () { return "cloud.heavyrain" },
        "313": function () { return "cloud.sleet" },
        "314": function () { return "cloud.drizzle" },
        "315": function () { return "cloud.rain" },
        "316": function () { return "cloud.heavyrain" },
        "317": function () { return "cloud.heavyrain" },
        "318": function () { return "cloud.heavyrain" },

        "399": function () { return "cloud.drizzle" },

        "350": function () { return "cloud.sun.rain" },
        "351": function () { return "cloud.sun.rain" },

        "400": function () { return "cloud.snow" },
        "401": function () { return "cloud.snow" },
        "402": function () { return "cloud.snow" },
        "403": function () { return "cloud.snow" },
        "404": function () { return "cloud.sleet" },
        "405": function () { return "cloud.sleet" },
        "406": function () { return "cloud.sleet" },
        "407": function () { return "cloud.snow" },
        "408": function () { return "cloud.snow" },
        "409": function () { return "cloud.snow" },
        "410": function () { return "cloud.snow" },

        "456": function () { return "cloud.sleet" },
        "457": function () { return "cloud.snow" },
        "499": function () { return "cloud.snow" },

        "500": function () { return "smoke" },
        "501": function () { return "smoke" },
        "502": function () { return "smoke" },
        "503": function () { return "smoke" },
        "504": function () { return "smoke" },
        "507": function () { return "smoke" },
        "508": function () { return "smoke" },
        "509": function () { return "smoke" },
        "510": function () { return "smoke" },
        "511": function () { return "smoke" },
        "512": function () { return "smoke" },
        "513": function () { return "smoke" },
        "514": function () { return "smoke" },
        "515": function () { return "smoke" },

        "900": function () { return "thermometer.sun" },
        "901": function () { return "thermometer.snowflake" },
        "999": function () { return "camera.metering.unknown" },
    }

    return SFSymbol.named(symbols[cond]()).image
}

function provideFont(fontName, fontSize) {
    const fontGenerator = {
        "ultralight": function () { return Font.ultraLightSystemFont(fontSize) },
        "light": function () { return Font.lightSystemFont(fontSize) },
        "regular": function () { return Font.regularSystemFont(fontSize) },
        "medium": function () { return Font.mediumSystemFont(fontSize) },
        "semibold": function () { return Font.semiboldSystemFont(fontSize) },
        "bold": function () { return Font.boldSystemFont(fontSize) },
        "heavy": function () { return Font.heavySystemFont(fontSize) },
        "black": function () { return Font.blackSystemFont(fontSize) },
        "italic": function () { return Font.italicSystemFont(fontSize) }
    }

    const systemFont = fontGenerator[fontName]
    if (systemFont) { return systemFont() }
    return new Font(fontName, fontSize)
}

function provideText(string, container, format) {
    const textItem = container.addText(string)
    const textFont = format.font || textFormat.defaultText.font
    const textSize = format.size || textFormat.defaultText.size
    const textColor = format.color || textFormat.defaultText.color

    textItem.font = provideFont(textFont, textSize)
    textItem.textColor = new Color(textColor)
    return textItem
}

function drawVerticalLine(color, height) {

    const width = 2

    let draw = new DrawContext()
    draw.opaque = false
    draw.respectScreenScale = true
    draw.size = new Size(width, height)

    let barPath = new Path()
    const barHeight = height
    barPath.addRoundedRect(new Rect(0, 0, width, height), width / 2, width / 2)
    draw.addPath(barPath)
    draw.setFillColor(color)
    draw.fillPath()

    return draw.getImage()
}

function drawTempBar() {

    const tempBarWidth = 200
    const tempBarHeight = 20

    let percent = (weatherData.currentTemp - weatherData.todayLow) / (weatherData.todayHigh - weatherData.todayLow)

    if (percent < 0) {
        percent = 0
    } else if (percent > 1) {
        percent = 1
    }

    const currPosition = (tempBarWidth - tempBarHeight) * percent

    let draw = new DrawContext()
    draw.opaque = false
    draw.respectScreenScale = true
    draw.size = new Size(tempBarWidth, tempBarHeight)

    let barPath = new Path()
    const barHeight = tempBarHeight - 10
    barPath.addRoundedRect(new Rect(0, 5, tempBarWidth, barHeight), barHeight / 2, barHeight / 2)
    draw.addPath(barPath)
    draw.setFillColor(new Color("#34495E", 0.5))
    draw.fillPath()

    let currPath = new Path()
    currPath.addEllipse(new Rect(currPosition, 0, tempBarHeight, tempBarHeight))
    draw.addPath(currPath)
    draw.setFillColor(new Color("#34495E", 1))
    draw.fillPath()

    return draw.getImage()
}

function cropImage(img, rect) {

    let draw = new DrawContext()
    draw.size = new Size(rect.width, rect.height)

    draw.drawImageAtPoint(img, new Point(-rect.x, -rect.y))
    return draw.getImage()
}

function phoneSizes() {
    let phones = {
        "2688": {
            "small": 507,
            "medium": 1080,
            "large": 1137,
            "left": 81,
            "right": 654,
            "top": 228,
            "middle": 858,
            "bottom": 1488
        },

        "1792": {
            "small": 338,
            "medium": 720,
            "large": 758,
            "left": 54,
            "right": 436,
            "top": 160,
            "middle": 580,
            "bottom": 1000
        },

        "2436": {
            "small": 465,
            "medium": 987,
            "large": 1035,
            "left": 69,
            "right": 591,
            "top": 213,
            "middle": 783,
            "bottom": 1353
        },

        "2208": {
            "small": 471,
            "medium": 1044,
            "large": 1071,
            "left": 99,
            "right": 672,
            "top": 114,
            "middle": 696,
            "bottom": 1278
        },

        "1334": {
            "small": 296,
            "medium": 642,
            "large": 648,
            "left": 54,
            "right": 400,
            "top": 60,
            "middle": 412,
            "bottom": 764
        },

        "1136": {
            "small": 282,
            "medium": 584,
            "large": 622,
            "left": 30,
            "right": 332,
            "top": 59,
            "middle": 399,
            "bottom": 399
        },

        "1624": {
            "small": 310,
            "medium": 658,
            "large": 690,
            "left": 46,
            "right": 394,
            "top": 142,
            "middle": 522,
            "bottom": 902
        }
    }
    return phones
}