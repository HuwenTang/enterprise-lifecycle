package com.tzdig.framework.util;

import com.tzdig.framework.mybatis.entity.zsxt.TFile;
import kotlin.jvm.functions.Function1;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Java 侧 S3 路径转换工具，避免在各个 VO 的 s3transform 中重复写 split/map/join。
 */
public final class S3TransformUtil {

    private S3TransformUtil() {
    }

    /**
     * 转换单个路径。
     */
    @Nullable
    public static String transform(
            @Nullable String path,
            @NotNull Function1<? super String, String> transform
    ) {
        if (path == null || path.isEmpty()) {
            return path;
        }
        return transform.invoke(path);
    }

    /**
     * 转换路径列表。
     */
    @Nullable
    public static List<String> transformList(
            @Nullable List<String> paths,
            @NotNull Function1<? super String, String> transform
    ) {
        if (paths == null || paths.isEmpty()) {
            return paths;
        }
        return paths.stream()
                .filter(Objects::nonNull)
                .map(path -> transform(path, transform))
                .collect(Collectors.toList());
    }

    /**
     * 转换逗号分隔的路径字符串。
     */
    @Nullable
    public static String transformCommaSeparated(
            @Nullable String rawPaths,
            @NotNull Function1<? super String, String> transform
    ) {
        return transformSeparated(rawPaths, ",", transform);
    }

    /**
     * 转换任意分隔符拼接的路径字符串。
     */
    @Nullable
    public static String transformSeparated(
            @Nullable String rawPaths,
            @NotNull String delimiter,
            @NotNull Function1<? super String, String> transform
    ) {
        if (rawPaths == null || rawPaths.isEmpty()) {
            return rawPaths;
        }
        return Arrays.stream(rawPaths.split(Pattern.quote(delimiter)))
                .map(path -> transform(path, transform))
                .collect(Collectors.joining(delimiter));
    }

    /**
     * 转换文件对象列表中的 filePath。
     */
    @Nullable
    public static List<TFile> transformFileList(
            @Nullable List<TFile> files,
            @NotNull Function1<? super String, String> transform
    ) {
        if (files == null || files.isEmpty()) {
            return files;
        }
        files.forEach(file -> {
            if (file != null) {
                file.setFilePath(transform(file.getFilePath(), transform));
            }
        });
        return files;
    }
}
