package com.swagger.controller;

import com.swagger.utils.NewVerifyCodeUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author Levin
 * @since 2018/10/8 0008
 */
@RestController
@RequestMapping("/images")
@Api(tags = "1.3", description = "图片管理", value = "图片管理")
public class ImageController {


    @GetMapping("/none")
    @ApiOperation(value = "验证码（NONE）")
    public void genCaptcha1(HttpServletResponse response) throws IOException {
        response.setContentType("image/jpeg");
        response.setHeader("Pragma", "No-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expires", 0);
        ServletOutputStream outputStream = response.getOutputStream();
        final String code = NewVerifyCodeUtils.outputNumberVerifyImage(outputStream);
        System.out.println(code);
        outputStream.flush();
        outputStream.close();
    }

    @GetMapping
    @ApiOperation(value = "验证码（NONE）", produces = MediaType.IMAGE_JPEG_VALUE)
    public void genCaptcha(HttpServletResponse response) throws IOException {
        response.setContentType("image/jpeg");
        response.setHeader("Pragma", "No-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expires", 0);
        ServletOutputStream outputStream = response.getOutputStream();
        final String code = NewVerifyCodeUtils.outputNumberVerifyImage(outputStream);
        System.out.println(code);
        outputStream.flush();
        outputStream.close();
    }


}

