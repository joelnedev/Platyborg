import { Snowflake } from "discord.js";

/**
 * An application command is the base "command" model that belongs to an application. This is what you are creating when you POST a new command.
 */
declare interface ApplicationCommand {
	/**
	 * 3-32 character name matching `^[\w-]{3,32}$`
	 */
	name: string,

	/**
	 * 1-100 character description
	 */
	description: string,

	/**
	 * The parameters for the command
	 */
	options?: ApplicationCommandOption[]
}

/**
 * Options to post with a command.
 */
declare interface ApplicationCommandOption {
	/**
	 * Type of option.
	 */
	type: ApplicationCommandOptionType,

	/**
	 * 1-32 character name matching `^[\w-]{1,32}$`.
	 */
	name: string,

	/**
	 * 1-100 character description.
	 */
	description: string,

	/**
	 * if the parameter is required or optional.
	 * @default false
	 */
	required?: boolean,

	/**
	 * choices for the user to pick from.
	 */
	choices?: ApplicationCommandOptionChoice[],

	/**
	 * if the option is a subcommand or subcommand group type, this nested options will be the parameters.
	 */
	options?: ApplicationCommandOption[]
}


declare enum ApplicationCommandOptionType {
	SUB_COMMAND = 1,

	SUB_COMMAND_GROUP = 2,

	STRING = 3,

	INTEGER = 4,

	BOOLEAN = 5,

	USER = 6,

	CHANNEL = 7,

	ROLE = 8
}

declare interface ApplicationCommandOptionChoice {
	name: string,

	value: string|number
}

/**
 * An interaction is the base "thing" that is sent when a user invokes a command, and is the same for Slash Commands and other future interaction types
 */
declare interface Interaction {
	/**
	 * ID of the interaction.
	 */
	id: Snowflake,

	/**
	 * The type of interaction.
	 */
	type: InteractionType,

	/**
	 * The command data payload (This is always present on `ApplicationCommand` interaction types; it is optional for future-proofing against new interaction types).
	 */
	data?: ApplicationCommandInteractionData,

	/**
	 * The guild it was sent from.
	 */
	guild_id: Snowflake,

	/**
	 * The channel it was sent from.
	 */
	channel_id: Snowflake,

	/**
	 * Guild member data for the invoking user, including permissions.
	 */
	member: any,

	/**
	 * A continuation token for responding to the interaction.
	 */
	token: string,

	/**
	 * Read-only property, always `1`
	 */
	version: number
}

/**
 * The type of interaction this request is.
 */
declare enum InteractionType {
	/**
	 * A ping.
	 */
	PING = 1,

	/**
	 * A command invocation.
	 */
	COMMAND = 2
}

declare interface ApplicationCommandInteractionData {
	/**
	 * The ID of the invoked command.
	 */
	id: Snowflake,

	/**
	 * The name of the invoked command.
	 */
	name: string,

	/**
	 * The params + values from the user.
	 */
	options?: ApplicationCommandInteractionDataOption[]

	/**
	 * Metadata for given options
	 */
	resolved?: {
		/**
		 * An object of requested members, keyed by their user id (found in option value)
		 */
		members?: any,

		/**
		 * An object of requested users, keyed by their id (found in option value)
		 */
		users?: any,

		/**
		 * An object of requested roles, keyed by their id (found in option value)
		 */
		roles?: any,

		/**
		 * An object of requested channels, keyed by their id (found in option value)
		 */
		channels?: any
	}
}

declare interface ApplicationCommandInteractionDataOption {
	/**
	 * The name of the parameter
	 */
	name: string,

	/**
	 * The value of the pair (mutually exclusive to `options`).
	 */
	value?: string|Snowflake|number|boolean,

	/**
	 * Present if this option is a group or subcommand (mutually exclusive to `value`).
	 */
	options?: ApplicationCommandInteractionDataOption[]
}

/**
 * The type of response that is being sent.
 */
declare enum InteractionResponseType {
	/**
	 * Acknowledge a `PING`.
	 */
	PONG = 1,

	/**
	 * Immediately respond with a message.
	 */
	CHANNEL_MESSAGE_WITH_SOURCE = 4,

	/**
	 * ACK an interaction and edit to a response later, the user sees a loading state.
	 */
	DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5
}

/**
 * Flags that can be included in an Interaction Response.
 */
declare enum InteractionResponseFlags {
	/**
	 * Show the message only to the user that performed the interaction. Message
	 * does not persist between sessions, and cannot yet contain embeds or attachments.
	 */
	EPHEMERAL = 64
}

declare interface Payload {
	type: InteractionResponseType,
	data: {
		content?: string,
		embeds?: any[],
		flags?: InteractionResponseFlags
		allowed_mentions?: any
	}
}

export { Interaction, InteractionType, InteractionResponseType, InteractionResponseFlags, ApplicationCommand, ApplicationCommandInteractionData, ApplicationCommandInteractionDataOption, ApplicationCommandOption, Payload };
