#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float _COLORS      = float(lut_tex_size.y);
    highp vec4 color       = subpassLoad(in_color).rgba;

    highp float IndexB = floor( color.z * _COLORS - 0.5 );
	highp float FractB = color.z * _COLORS - 0.5 - IndexB;

    highp float U = (color.x + IndexB) / _COLORS;
	highp float V = color.y;

    highp vec4 color_min = texture(color_grading_lut_texture_sampler, vec2(U,V));
    highp vec4 color_max = texture(color_grading_lut_texture_sampler, vec2(U + (1.0/_COLORS),V));

    out_color = mix(color_min, color_max, FractB);
}
