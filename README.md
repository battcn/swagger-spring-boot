# 简介 #

> 源码地址

- GitHub：[https://github.com/battcn/spring-boot-starter-swagger](https://github.com/battcn/spring-boot-starter-swagger "https://github.com/battcn/spring-boot-starter-swagger")
- 码云：

`spring-boot-starter-swagger` 是一款建立在`swagger`基础之上的工具包，利用SpringBoot自动装配的特性，简化了传统`swagger`的繁琐配置


有兴趣扩展自己的Starter包的可以参考文章：[编写自己的starter项目](http://blog.battcn.com/2017/07/13/springboot/springboot-starter-swagger/ "编写自己的starter项目")

** 如果该项目对您有帮助，欢迎Fork和Star，有疑问可以加 ** `QQ：1837307557`一起交流 ，如发现项目BUG可以提交`Issue`


# 使用 #

只需一个小小的注解`@EnableSwagger2Doc`即可完成默认装配，当然更强大的功能在后面

- 在`pom.xml`中引入依赖：

``` xml
<dependency>
    <groupId>com.battcn</groupId>
    <artifactId>spring-boot-starter-swagger</artifactId>
    <version>1.3.4-RELEASE</version>
</dependency>
```

- 在应用主类中增加`@EnableSwagger`注解

``` java
@EnableSwagger2Doc
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
```

# 重写UI #

默认的UI在多个接口和大量参数下显得有点力不从心了，这时候在网上发现一款名为 [Swagger-Bootstrap-UI](https://github.com/xiaoymin/Swagger-Bootstrap-UI "https://github.com/xiaoymin/Swagger-Bootstrap-UI") 引起了我浓烈的兴趣，但使用下来发现问题也不不少，故而在此基础之上做了二次开发

> 接口说明：折叠式Model

![接口说明](http://image.battcn.com/article/images/20171204/springboot/spring-boot-starter-swagger/1.png)


> 接口说明：折叠式表单响应内容，告别长长的滚动条

![接口说明](http://image.battcn.com/article/images/20171204/springboot/spring-boot-starter-swagger/2.png)

> 在线调试

![在线调试](http://image.battcn.com/article/images/20171204/springboot/spring-boot-starter-swagger/3.png)


# 配置示例 #



## 配置说明 ##



## 默认配置 ##

```
spring.swagger.enabled=是否启用swagger，默认：true
spring.swagger.title=标题
spring.swagger.description=描述
spring.swagger.version=版本
spring.swagger.license=许可证
spring.swagger.licenseUrl=许可证URL
spring.swagger.termsOfServiceUrl=服务条款URL
spring.swagger.contact.name=维护人
spring.swagger.contact.url=维护人URL
spring.swagger.contact.email=维护人email
spring.swagger.base-package=swagger扫描的基础包，默认：全扫描
spring.swagger.base-path=需要处理的基础URL规则，默认：/**
spring.swagger.exclude-path=需要排除的URL规则，默认：空
spring.swagger.host=文档的host信息，默认：空
spring.swagger.globalOperationParameters[0].name=参数名
spring.swagger.globalOperationParameters[0].description=描述信息
spring.swagger.globalOperationParameters[0].modelRef=指定参数类型
spring.swagger.globalOperationParameters[0].parameterType=指定参数存放位置,参考ParamType:(header,query,path,body,form)
spring.swagger.globalOperationParameters[0].required=指定参数是否必传，默认false
```


# 贡献者 #

Levin：1837307557@qq.com  

- 个人博文：[http://blog.battcn.com](http://blog.battcn.com "http://blog.battcn.com")

_Rock：995269937@qq.com



# 常用注解说明 #

* `@Api`:一般用于Controller中,用于接口分组,使用如下图：


* `@ApiOperation`:接口说明,用于api方法上


* `@ApiImplicitParam`:参数说明,适用于只有一个请求参数,主要参数


* `@ApiImplicitParams`:多个参数说明,主要参数参考上面`@ApiImplicitParam`


* `@ApiModelProperty`:实体参数说明


# 如何参与 #

有兴趣的可以联系本人（Pull Request），参与进来一起开发，美化UI与配置项一起完善